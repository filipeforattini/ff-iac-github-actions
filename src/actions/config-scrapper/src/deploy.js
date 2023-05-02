const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const core = require("@actions/core");
const github = require("@actions/github");

const logger = require('../log')

module.exports = async (analysis) => {
  let containerRegistry = core.getInput('containerRegistry');

  const commitSha = github.context.sha.substring(0,7)
  const slugedBranch = github.context.ref
    .replace('refs/heads/', '')
    .replace('refs/tags/', '')
    .replace('/', '-')

  const [ organization, name ] = github.context.payload.repository.full_name.split('/')
  const registry = [ containerRegistry, organization, name].join('/')

  analysis.deployment.registry = registry

  let tag = `c-${commitSha}`
  let tags = [
    `latest`,
    `c-${commitSha}`,
    `b-${slugedBranch}`,
    `r-${github.context.runNumber}`,
    `u-${github.context.actor}`,
    `u-${github.context.actor}-b-${slugedBranch}`,
  ]

  if (_.isString(analysis.environment)) {
    tag = `r-${github.context.runNumber}`
    tags = tags.concat([
      `e-${analysis.environment}`,
      `e-${analysis.environment}-b-${slugedBranch}`,
      `e-${analysis.environment}-u-${github.context.actor}`,
    ])
  }

  // push
  const committedAt = github.context.payload.head_commit
    ? new Date(github.context.payload.head_commit.timestamp) // push
    : github.context.payload.pull_request
      ? new Date(github.context.payload.pull_request.updated_at) // pr
      : github.context.payload.deployment
        ? new Date(github.context.payload.deployment.created_at) // deployment
        : null

  if (committedAt) {
    tags = tags.concat([
      `t-${committedAt.getTime()}`,
      `d-${committedAt.toISOString().substring(0,10)}`,
      `b-${slugedBranch}-t-${committedAt.getTime()}`,
      `b-${slugedBranch}-d-${committedAt.toISOString().substring(0,10)}`,
    ])
  
    if (_.isString(analysis.environment)) {
      tags = tags.concat([
        `e-${analysis.environment}-t-${committedAt.getTime()}`,
        `e-${analysis.environment}-d-${committedAt.toISOString().substring(0,10)}`,
      ])
    }
  }

  tags = _(tags).sortBy().value()

  const fullname_tag = `${registry}:${tag}`
  const fullname_tags = tags.map(t => `${registry}:${t}`)

  analysis.deployment.tag = tag
  analysis.deployment.tags = tags
  analysis.deployment.fullname_tag = fullname_tag
  analysis.deployment.fullname_tags = fullname_tags
  analysis.deployment.tagsString = fullname_tags.join(',')
  logger.info('deployment', `tag = ${tag}`)

  let args = ""
  if (_.isString(analysis.environment)) {
    if(fs.existsSync(path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`))) {
      args = fs.readFileSync(path.join(analysis.root, 'manifests', 'configs', `${analysis.environment}.env`))
      args = args.toString()
        .trim()
        .split('\n')
        .map(x => x.split(`=`))
        .map(([x, ...y]) => `--build-arg ${x}="${y.join('=')}"`).join(' ')
    }
  }

  analysis.deployment.build_args = args 

  let labels = [ `org.opencontainers.image.source=https://github.com/${organization}/${name}` ]
  analysis.deployment.labels = labels 
  analysis.deployment.labelsString = labels.join(',')
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
