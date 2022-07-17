const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  let containerRegistry = core.getInput('containerRegistry', { required: true });

  const [ organization, name ] = github.context.payload.repository.full_name.split('/')
  const imageFullName = [ containerRegistry, organization, name].join('/')

  if (github.context.payload.deployment) {
    analysis.environment = github.context.payload.deployment.environment
    analysis.outputs.environment = analysis.environment
  }


  let tags = [
    `latest`,
    `r-${github.context.runNumber}`,
    `c-${github.context.sha.substring(0,7)}`,
    `b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
    `u-${github.context.actor}`,
  ]

  // push
  if (github.context.payload.head_commit) {
    const committedAt = new Date(github.context.payload.head_commit.timestamp)

    tags = tags.concat([
      `d-${committedAt.toISOString().substring(0,10)}`,
      `t-${committedAt.getTime()}`,
    ])
  }

  // pull_request
  if (github.context.payload.pull_request) {
    const committedAt = new Date(github.context.payload.pull_request.updatedAt)
    
    tags = tags.concat([
      `d-${committedAt.toISOString().substring(0,10)}`,
      `t-${committedAt.getTime()}`,
    ])
  }

  tags = tags.map(t => `${imageFullName}:${t}`)

  analysis.deployment.tags = tags
  analysis.deployment.tagsString = tags.join(',')
}
