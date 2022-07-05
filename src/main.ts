import * as core from '@actions/core'
import {card} from './card'

async function run(): Promise<void> {
  const host = core.getInput('host', {required: true})
  const port = parseInt(core.getInput('port'))
  const bgImage = core.getInput('bgImage')
  card(host, port, bgImage)
}

run()
