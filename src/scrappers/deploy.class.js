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
    const hasDependencies = fs.existsSync(path.join(process.cwd(), 'manifests', 'resources.yml'))
    
    let envs = [ 'dev', 'stg', 'prd', 'sbx', 'dry' ]

    const { namespaces, secrets, configs } = envs.reduce((acc, env) => {
      acc.configs[env] = fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', env + '.env'))
      acc.secrets[env] = fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', env + '.gpg'))
      acc.namespaces[env] = `${repository}-${env}`
      return acc
    }, { 
      configs: {},
      secrets: {}, 
      namespaces: {}, 
    })

    this
      .add('dockerfile', {
        containerRegistry,
      })
      .add('deploy', {
        podName,
        ecosystem,
        namespace: repository,
        namespaces,
        secrets,
        configs,
        deployAsK8s,
        deployAsChart,
        hasDependencies,
        containerRegistry,
      })
  }
}
