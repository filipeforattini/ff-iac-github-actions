const fs = require('fs')
const path = require('path')
const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  let environment = core.getInput('environment', { required: false });
  let containerRegistry = core.getInput('containerRegistry', { required: true });

  const commitSha = github.context.sha.substring(0,7)
  const [ organization, name ] = github.context.payload.repository.full_name.split('/')
  const registry = [ containerRegistry, organization, name].join('/')

  analysis.deployment.registry = registry

  if (github.context.payload.deployment) {
    analysis.environment = github.context.payload.deployment.environment
    analysis.outputs.environment = analysis.environment
  }

  let tag = `${registry}:c-${commitSha}`
  let tags = [
    `latest`,
    `c-${commitSha}`,
    `r-${github.context.runNumber}`,
    `b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
    `u-${github.context.actor}`,
  ]

  if (environment) {
    tag = `${registry}:e-${environment}-c-${commitSha}`
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
      `t-${committedAt.getTime()}`,
      `d-${committedAt.toISOString().substring(0,10)}`,
    ])
  
    if (environment) {
      tags = tags.concat([
        `e-${environment}-t-${committedAt.getTime()}`,
        `e-${environment}-d-${committedAt.toISOString().substring(0,10)}`,
      ])
    }
  }

  tags = tags.map(t => `${registry}:${t}`)

  analysis.deployment.tag = tag
  analysis.deployment.tags = tags
  analysis.deployment.tagsString = tags.join(', ')

  let args = ""
  if (environment) {
    if(fs.existsSync(path.join(analysis.root, 'manifests', 'config', `${environment}.env`))) {
      args = fs.readFileSync(path.join(analysis.root, 'manifests', 'config', `${environment}.env`)).toString()
      args = args.replace('\n', ', ')
    }
  }

  analysis.deployment.build_args = args
  
  // outputs
  analysis.outputs.registry = analysis.deployment.registry
  analysis.outputs.build_args = analysis.deployment.build_args
  analysis.outputs.build_tags = analysis.deployment.tagsString
  analysis.outputs.deploy_tag = analysis.deployment.tag
}
