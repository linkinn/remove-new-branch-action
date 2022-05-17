import * as core from '@actions/core'
import {getOctokit, context} from '@actions/github'
import {slack} from './slack-send'

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
  const {ref, eventName, repo} = context
  core.debug(`Event name: ${eventName}`)
  core.debug(`Branch ref: ${ref}`)

  if (!ref.startsWith('refs/heads')) {
    core.debug(`Branch ${ref} e um tag`)
    return
  }

  const branchName = ref.split('refs/heads/')[1]

  const branchValidate = allowedBranchList
    .split(',')
    .filter(prefix => branchName.startsWith(prefix))

  core.debug(`Branch list filter: ${JSON.stringify(branchValidate)}`)
  core.debug(`Quantity branch list: ${branchValidate.length}`)
  if (branchValidate.length) {
    core.debug(`Branch ${branchName} is validate`)
    return
  }

  core.debug(`Branch ${branchName} not is validate`)
  await toolKit.rest.git.deleteRef({
    ...repo,
    ref: `heads/${branchName}`
  })

  const slackToken = process.env.SLACK_TOKEN
  const payload = core.getInput('payload')
  const channelID = core.getInput('channelID')
  if (slackToken) {
    slack({
      payload,
      channelID,
      branchName,
      repoName: repo.repo,
      slackToken
    })
  }

  core.debug(`Branch name: ${branchName}`)
}
