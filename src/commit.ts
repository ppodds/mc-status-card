import {info, setFailed} from '@actions/core'
import {context, getOctokit} from '@actions/github'

export async function commit(token: string, image: Buffer): Promise<void> {
  const octokit = getOctokit(token)
  info('Pushing commit')
  try {
    const result = await octokit.rest.repos.createOrUpdateFileContents({
      ...context.repo,
      path: './status_card.png',
      message: 'Update status card',
      content: image.toString('base64')
    })
    info(`Commit pushed: ${result.data.commit.sha}`)
  } catch (e: any) {
    setFailed(e.message)
  }
  info('Done')
}
