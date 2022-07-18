const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const core = require("@actions/core");
const github = require("@actions/github");

const { templateInfo } = require('../log')

module.exports = async (analysis) => {
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

  if (_.isString(analysis.environment)) {
    tag = `${registry}:e-${analysis.environment}-c-${commitSha}`
    tags = tags.concat([
      `e-${analysis.environment}-latest`,
      `e-${analysis.environment}-r-${github.context.runNumber}`,
      `e-${analysis.environment}-c-${commitSha}`,
      `e-${analysis.environment}-b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
      `e-${analysis.environment}-u-${github.context.actor}`,
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
  
    if (_.isString(analysis.environment)) {
      tags = tags.concat([
        `e-${analysis.environment}-t-${committedAt.getTime()}`,
        `e-${analysis.environment}-d-${committedAt.toISOString().substring(0,10)}`,
      ])
    }
  }

  tags = tags.map(t => `${registry}:${t}`)

  analysis.deployment.tag = tag
  analysis.deployment.tags = tags
  analysis.deployment.tagsString = tags.join(', ')

  let args = ""
  if (_.isString(analysis.environment)) {
    if(fs.existsSync(path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`))) {
      args = fs.readFileSync(path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`)).toString()
      args = args.replace('\n', ', ')
    }
  }

  analysis.deployment.build_args = args 
  core.info(templateInfo('deployment', `tag = ${tag}`))

  // outputs
  analysis.outputs.registry = analysis.deployment.registry
  analysis.outputs.build_args = analysis.deployment.build_args
  analysis.outputs.build_tags = analysis.deployment.tagsString
  analysis.outputs.deploy_tag = analysis.deployment.tag
}
