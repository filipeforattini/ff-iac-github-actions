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
    `u-${github.context.actor}`,
    `r-${github.context.runNumber}`,
    `b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
  ]

  if (_.isString(analysis.environment)) {
    tag = `${registry}:e-${analysis.environment}-c-${commitSha}`
    tags = tags.concat([
      `e-${analysis.environment}-latest`,
      `e-${analysis.environment}-c-${commitSha}`,
      `e-${analysis.environment}-u-${github.context.actor}`,
      `e-${analysis.environment}-r-${github.context.runNumber}`,
      `e-${analysis.environment}-b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
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
  core.info(templateInfo('deployment', `tag = ${tag}`))

  let args = ""
  if (_.isString(analysis.environment)) {
    if(fs.existsSync(path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`))) {
      args = fs.readFileSync(path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`))
      args = args.toString().trim().split('\n').join(', ')
    }
  }

  analysis.deployment.build_args = args 

  let labels = [ `org.opencontainers.image.source=https://github.com/${organization}/${name}` ]
  analysis.deployment.labels = labels 
  analysis.deployment.labelsString = labels.join(', ')
  core.info(templateInfo('deployment', `labels = ${labels}`))

  // outputs
  analysis.outputs.registry = analysis.deployment.registry
  analysis.outputs.deploy_tag = analysis.deployment.tag
  analysis.outputs.build_args = analysis.deployment.build_args
  analysis.outputs.build_tags = analysis.deployment.tagsString
  analysis.outputs.build_labels = analysis.deployment.labelsString
}
