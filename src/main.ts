import * as core from '@actions/core'
import {execute} from './remove-new-branch'

async function run(): Promise<void> {
  try {
    core.debug(`stating`)
    const allowedBranchList = core.getInput('allowed_branch_list')
    execute({allowedBranchList})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
