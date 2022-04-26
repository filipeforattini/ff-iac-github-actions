const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Deploy extends Scrapper {
  setup () {
    const repository = this.context.payload.repository.full_name

    const pipeline = repository.includes('-svc-')
      ? 'svc'
      : repository.includes('-app-')
        ? 'app'
        : repository.includes('-iac-')
          ? 'iac'
          : 'unknown'


    const containerRegistry = this.inputs.containerRegistry
    const containerName = this.context.payload.repository.full_name

    const deployAsK8s = fs.existsSync(path.join(process.cwd(), 'manifests', 'k8s-values.yml'))
      ? true
      : false

    const deployAsChart = fs.existsSync(path.join(process.cwd(), 'manifests', 'charts-values.yml'))
      ? true
      : false

    this
      .add('dockerfile', {
        containerRegistry,
      })
      .add('deploy', {
        pipeline,
        deployAsK8s,
        deployAsChart,
        containerName,
        podName: pipeline,
        containerRegistry,
      })
  }
}
