import * as core from '@actions/core'
import {card} from './card'
import {commit} from './commit'

async function run(): Promise<void> {
  const host = core.getInput('host', {required: true})
  const port = parseInt(core.getInput('port'))
  const bgImage = core.getInput('bgImage')
  const token = core.getInput('token', {required: true})
  await commit(token, await card(host, port, bgImage))
}

run()
