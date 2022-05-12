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
    const deployAsChart = fs.existsSync(path.join(process.cwd(), 'manifests', 'charts-values.yml'))
    
    const secrets = {
      dev: fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'dev.gpg')),
      stg: fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'stg.gpg')),
      prd: fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'prd.gpg')),
      sbx: fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'sbx.gpg')),
      dry: fs.existsSync(path.join(process.cwd(), 'manifests', 'secrets', 'dry.gpg')),
    }

    const configs = {
      dev: fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', 'dev.env')),
      stg: fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', 'stg.env')),
      prd: fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', 'prd.env')),
      sbx: fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', 'sbx.env')),
      dry: fs.existsSync(path.join(process.cwd(), 'manifests', 'configs', 'dry.env')),
    }

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
        secrets,
        configs,
        deployAsK8s,
        deployAsChart,
        containerRegistry,
      })
  }
}
