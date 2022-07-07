import {info, setFailed} from '@actions/core'
import {context, getOctokit} from '@actions/github'

export async function commit(
  token: string,
  image: Buffer,
  branch: string
): Promise<void> {
  const octokit = getOctokit(token)
  try {
    info('Get head commit')
    const {
      data: {
        object: {sha: headSha}
      }
    } = await octokit.rest.git.getRef({
      ...context.repo,
      ref: `heads/${branch}`
    })
    const {data: blob} = await octokit.rest.git.createBlob({
      ...context.repo,
      content: image.toString('base64'),
      encoding: 'base64'
    })
    info('Create tree')
    const {
      data: {sha: treeSha}
    } = await octokit.rest.git.createTree({
      ...context.repo,
      tree: [
        {
          type: 'blob',
          path: 'status_card.png',
          mode: '100644',
          ...blob
        }
      ],
      base_tree: headSha
    })
    info('Create commit')
    const {
      data: {sha: commitSha}
    } = await octokit.rest.git.createCommit({
      ...context.repo,
      message: 'Update status card',
      tree: treeSha,
      parents: [headSha]
    })
    await octokit.rest.git.updateRef({
      ...context.repo,
      ref: `heads/${branch}`,
      sha: commitSha
    })
    info(`Commit pushed: ${commitSha}`)
  } catch (e: any) {
    setFailed(e.message)
  }
}
