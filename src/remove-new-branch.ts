import * as core from '@actions/core'
import {getOctokit, context} from '@actions/github'

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError('No token defined in the environment variables')
  return token
}

export async function execute(): Promise<void> {
  getOctokit(githubToken())
  const {ref} = context

  if (!ref.startsWith('refs/heads')) {
    core.debug(`Branch ${ref} e um tag`)
    return
  }

  const branchName = ref.split('refs/heads')

  core.debug(`Branch name: ${branchName}`)
}
