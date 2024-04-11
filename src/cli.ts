import process from 'node:process'
import yargs from 'yargs'
import colors from 'picocolors'
import { hideBin } from 'yargs/helpers'
import { version } from '../package.json'

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName('pkg-name')
  .command('say [name]', 'start the server', (yargs) => {
    return yargs
      .positional('name', {
        describe: 'name to bind on',
        default: 'zwkang',
      })
  }, (argv) => {
    if (argv.name)
      process.stdout.write(`Hello ${colors.green(argv.name)}!\n`)
  })
  .showHelpOnFail(true)
  .alias('h', 'help')
  .version('version', version)
  .alias('v', 'version')
  .help()
  .argv
