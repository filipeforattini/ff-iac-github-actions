const github = require("@actions/github");
const dayjs = require('dayjs')

module.exports = async (analysis) => {
  const commitSha = github.context.sha.substring(0,7)
  analysis.outputs.commit_hash = commitSha

  if (github.context.payload.head_commit) {
    analysis.commiter = { ...github.context.payload.head_commit.committer}

    analysis.outputs.commiter_name = analysis.commiter.name
    analysis.outputs.commiter_email = analysis.commiter.email
    analysis.outputs.commiter_username = analysis.commiter.username

    analysis.outputs.executed_at = dayjs(github.context.payload.head_commit.timestamp)
  }

  if (github.context.payload.deployment) {
    analysis.outputs.executed_at = dayjs(github.context.payload.deployment.updated_at)
  }
}
