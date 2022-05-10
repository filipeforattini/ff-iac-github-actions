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
          : 'unknown'

    const ecosystem = this.inputs.ecosystem || repository.split('-')[0]

    const deployAsK8s = fs.existsSync(path.join(process.cwd(), 'manifests', 'k8s-values.yml'))
      ? true
      : false

    const deployAsChart = fs.existsSync(path.join(process.cwd(), 'manifests', 'charts-values.yml'))
      ? true
      : false
    
    const hasDevSecrets = fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'dev.gpg'))
      ? true
      : false

    const hasStgSecrets = fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'stg.gpg'))
      ? true
      : false

    this
      .add('dockerfile', {
        containerRegistry,
      })
      .add('deploy', {
        podName,
        ecosystem,
        namespace: repository,
        namespaces: {
          dev: `${repository}-dev`,
          stg: `${repository}-stg`,
          prd: `${repository}-prd`,
          sbx: `${repository}-sbx`,
          dry: `${repository}-dry`,
        },
        deployAsK8s,
        hasDevSecrets,
        hasStgSecrets,
        deployAsChart,
        containerRegistry,
      })
  }
}
