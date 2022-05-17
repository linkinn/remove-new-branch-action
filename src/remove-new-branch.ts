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

  core.debug(ref)
}
