const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  let environment = core.getInput('environment', { required: false });
  let containerRegistry = core.getInput('containerRegistry', { required: true });

  const commitSha = github.context.sha.substring(0,7)
  const [ organization, name ] = github.context.payload.repository.full_name.split('/')
  const imageFullName = [ containerRegistry, organization, name].join('/')

  if (github.context.payload.deployment) {
    analysis.environment = github.context.payload.deployment.environment
    analysis.outputs.environment = analysis.environment
  }

  let tag = `c-${commitSha}`
  let tags = [
    `latest`,
    `r-${github.context.runNumber}`,
    `c-${commitSha}`,
    `b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
    `u-${github.context.actor}`,
  ]

  if (environment) {
    tag = `e-${environment}-c-${commitSha}`
    tags = tags.concat([
      `e-${environment}-latest`,
      `e-${environment}-r-${github.context.runNumber}`,
      `e-${environment}-c-${commitSha}`,
      `e-${environment}-b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
      `e-${environment}-u-${github.context.actor}`,
    ])
  }

  // push
  const committedAt = github.context.payload.head_commit
    ? new Date(github.context.payload.head_commit.timestamp) // push
    : github.context.payload.pull_request
      ? new Date(github.context.payload.pull_request.updatedAt) // pr
      : null

  if (committedAt) {
    tags = tags.concat([
      `d-${committedAt.toISOString().substring(0,10)}`,
      `t-${committedAt.getTime()}`,
    ])
  
    if (environment) {
      tags = tags.concat([
        `e-${environment}-d-${committedAt.toISOString().substring(0,10)}`,
        `e-${environment}-t-${committedAt.getTime()}`,
      ])
    }
  }

  tags = tags.map(t => `${imageFullName}:${t}`)

  analysis.deployment.tag = tag
  analysis.deployment.tags = tags
  analysis.deployment.tagsString = tags.join(',')

  // outputs
  analysis.outputs.event = analysis.event
  analysis.outputs.tag = analysis.deployment.tag
  analysis.outputs.tags = analysis.deployment.tagsString
}
