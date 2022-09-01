const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const core = require("@actions/core");
const github = require("@actions/github");

const logger = require('../log')

module.exports = async (analysis) => {
  let containerRegistry = core.getInput('containerRegistry', { required: true });

  const commitSha = github.context.sha.substring(0,7)
  const [ organization, name ] = github.context.payload.repository.full_name.split('/')
  const registry = [ containerRegistry, organization, name].join('/')

  analysis.deployment.registry = registry

  let tag = `c-${commitSha}`
  let tags = [
    `latest`,
    `c-${commitSha}`,
    `r-${github.context.runNumber}`,
    `u-${github.context.actor}`,
    `u-${github.context.actor}-c-${commitSha}`,
    `b-${github.context.ref.replace('refs/heads/', '').replace('/', '-')}`,
  ]

  if (_.isString(analysis.environment)) {
    tag = `e-${analysis.environment}-c-${commitSha}`
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
      ? new Date(github.context.payload.pull_request.updated_at) // pr
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

  const fullname_tag = `${registry}:${tag}`
  const fullname_tags = tags.map(t => `${registry}:${t}`)

  analysis.deployment.tag = tag
  analysis.deployment.tags = tags
  analysis.deployment.fullname_tag = fullname_tag
  analysis.deployment.fullname_tags = fullname_tags
  analysis.deployment.tagsString = fullname_tags.join(', ')
  logger.info('deployment', `tag = ${tag}`)

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
  logger.info('deployment', `labels = ${labels}`)


  if (github.context.payload.deployment) {
    // k8s
    analysis.deployment.namespace = `${name}-${analysis.environment}`
    analysis.outputs.deploy_namespace = analysis.deployment.namespace

    const configsFilePath = path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`)
    const secretsFilePath = path.join(analysis.root, 'manifests', 'secrets', `${analysis.environment}.gpg`)
    const dependenciesFilePath = path.join(analysis.root, 'manifests', 'dependencies', `${analysis.environment}.yml`)

    if(fs.existsSync(configsFilePath)) {
      analysis.deployment.configsFile = configsFilePath
      analysis.outputs.deploy_configs_file = configsFilePath
      analysis.outputs.feature_has_configs = true
    }
    
    if(fs.existsSync(secretsFilePath)) {
      analysis.deployment.secretsFile = secretsFilePath
      analysis.outputs.deploy_secrets_file = secretsFilePath
      analysis.outputs.feature_has_secrets = true
    }
    
    if(fs.existsSync(dependenciesFilePath)) {
      analysis.deployment.dependenciesFile = dependenciesFilePath
      analysis.outputs.deploy_dependencies_file = dependenciesFilePath
      analysis.outputs.feature_has_dependencies = true
    }
  }

  // outputs
  analysis.outputs.registry = analysis.deployment.registry
  analysis.outputs.deploy_tag = analysis.deployment.tag
  analysis.outputs.deploy_fullname_tag = analysis.deployment.fullname_tag
  analysis.outputs.build_args = analysis.deployment.build_args
  analysis.outputs.build_tags = analysis.deployment.tagsString
  analysis.outputs.build_labels = analysis.deployment.labelsString
}
