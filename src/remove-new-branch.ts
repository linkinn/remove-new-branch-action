import * as core from '@actions/core'
import {getOctokit, context} from '@actions/github'

interface IRemoveBranchList {
  allowedBranchList: string
}

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError('No token defined in the environment variables')
  return token
}

export async function execute({
  allowedBranchList
}: IRemoveBranchList): Promise<void> {
  const toolKit = getOctokit(githubToken())
  const {ref, eventName} = context
  core.debug(`Event name: ${eventName}`)

  if (!ref.startsWith('refs/heads')) {
    core.debug(`Branch ${ref} e um tag`)
    return
  }

  const branchName = ref.split('refs/heads/')[1]

  const branchValidate = allowedBranchList.split(',').filter(prefix => branchName.startsWith(prefix))

  if (branchValidate.length) {
    core.debug(`Branch ${branchName} e valida`)
    return
  }

  core.debug(`Branch ${branchName} nao e valida`)
  toolKit.rest.git.deleteRef({
    ...context.repo,
    ref: `refs/heads/${branchName}`
  })

  core.debug(`Branch name: ${branchName}`)
}
