import process from 'node:process'
import cac from 'cac'
import colors from 'picocolors'
import { hideBin } from 'yargs/helpers'
import { version } from '../package.json'

const cli = cac('create-static-server-when-trigger-start')

cli
  .command("start", 'start a test')
  .option('--port <port>', 'Port', { default: process.env.PORT || 7777 })
  .option('--open', 'Open browser', { default: true })
  .action(async options => {
    console.log(colors.green('Starting a test...'))
    // console.log(options)
  })
