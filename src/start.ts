import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws'
import chokidar from 'chokidar'
import fg from 'fast-glob';

export async function dirList(args: { cwd: string }) {
  const files = await fg(["**/*"], {
    cwd: args.cwd,
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
    ],
    deep: 3,
    onlyFiles: true,
  })
  console.log(files, args.cwd)
  return files;
}

export function start(args: { cwd: string }) {
  const wss = new WebSocketServer({
    port: 7811,
  })

  const wsClients = new Set<WebSocket>()
  wss.on('connection', ws => {
    wsClients.add(ws)
    console.log('Websocket client connected')
    ws.on('close', () => wsClients.delete(ws))
  })

  const watcher = chokidar.watch([], {
    ignoreInitial: true,
    disableGlobbing: true,
    cwd: args.cwd,
  })

  watcher.on('change', path => {
    console.log('Config change detected', path)
    wsClients.forEach(ws => ws.send(JSON.stringify({
      type: 'config-change',
      path,
    })))
  })

  watcher.add(args.cwd);

  return {
    watcher,
    wss,
  }
}
