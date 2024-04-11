import { eventHandler, createApp, serveStatic, toNodeListener } from 'h3';
import { dirList, start } from './start';
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { lookup } from 'mrmime'
import open from 'open'

export function createHostServer() {
  const app = createApp();
  start({ cwd: process.cwd() });
  console.log(process.cwd() )
  app.use('/api/payload.json', eventHandler(async (event) => {
    return event.node.res.end(JSON.stringify({ files: await dirList({ cwd: join(process.cwd(), 'src') })} ));
  }))

  const dist = join(process.cwd(),'front-end', 'dist');

  app.use('/', eventHandler(async event => {
    const result = await serveStatic(event, {
      fallthrough: true,
      getContents: id => {
        console.log(id);
        return readFile(join(dist, id), 'utf-8')
      },
      getMeta: async id => {
        // return undefined
        const stats = await stat(join(dist, id)).catch(() => {});

        if (!stats || !stats.isFile()) {
          return;
        }

        return {
          type: lookup(id),
          size: stats.size,
          mtime: stats.mtimeMs,
        };
      }
    })

    // console.log(result);

    if(result === false) {
      return readFile(join(dist, 'index.html'), 'utf8');
    }
  }))

  return createServer(toNodeListener(app));
}

const server = createHostServer();
server.listen(8888, '', () => {
  console.log('Server started at http://localhost:8888')
  open('http://localhost:8888');
})



