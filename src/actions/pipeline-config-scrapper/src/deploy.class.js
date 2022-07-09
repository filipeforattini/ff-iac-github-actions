const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Deploy extends Scrapper {
  setup () {
    const repository = this.context.payload.repository.name
    const containerRegistry = this.inputs.containerRegistry

    const podName = repository.includes('-svc-')
      ? 'svc'
      : repository.includes('-app-')
        ? 'app'
        : repository.includes('-iac-')
          ? 'iac'
          : repository.includes('-mob-')
            ? 'mob'
            : 'unknown'

    const ecosystem = this.inputs.ecosystem || repository.split('-')[0]

    const deployAsK8s = fs.existsSync(path.join(process.cwd(), 'manifests', 'k8s-values.yml'))
    const deployAsChart = fs.existsSync(path.join(process.cwd(), 'manifests', 'charts-values.yml'))
    
    let envs = [ 'dev', 'stg', 'prd', 'sbx', 'dry' ]

    const { namespaces, secrets, configs, dependencies, buildArgs } = envs.reduce((acc, env) => {
      acc.configs[env] = fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', env + '.env'))
      acc.dependencies[env] = fs.existsSync(path.join(process.cwd(), 'manifests', 'dependencies', env + '.yml'))
      acc.namespaces[env] = `${repository}-${env}`
      acc.secrets[env] = fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', env + '.gpg'))

      acc.buildArgs[env] = acc.configs[env]
        ? fs.readFileSync(path.join(process.cwd(), 'manifests', 'configs', env + '.env')).toString().trim().split('\n').join(', ')
        : ''

      return acc
    }, { 
      configs: {},
      dependencies: {},
      namespaces: {}, 
      secrets: {},
      buildArgs: {},
    })

    this
      .add('dockerfile', {
        buildArgs,
        containerRegistry,
      })
      .add('deploy', {
        configs,
        containerRegistry,
        dependencies,
        deployAsChart,
        deployAsK8s,
        ecosystem,
        namespace: repository,
        namespaces,
        podName,
        secrets,
      })
  }
}
