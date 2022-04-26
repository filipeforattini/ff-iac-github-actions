const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Docker extends Scrapper {
  setup () {
    const hasDockerfile = fs.existsSync(path.join(process.cwd(), 'dockerfile'))
      ? true
      : false

    const hasDockerignore = fs.existsSync(path.join(process.cwd(), '.dockerignore'))
      ? true
      : false

    const containerRegistry = this.inputs.containerRegistry
    const containerName = this.context.payload.repository.full_name

    let tags = [
      `${containerRegistry}/${containerName}:latest`,
      `${containerRegistry}/${containerName}:d-${this.output.run.date}`,
      `${containerRegistry}/${containerName}:b-${this.output.git.branch}`,
      `${containerRegistry}/${containerName}:c-${this.output.git.commit}`,
      `${containerRegistry}/${containerName}:t-${this.output.run.startTimestamp}`,
        // `${containerRegistry}/${containerName}:node-${matrix.node-version}`,
        // `${containerRegistry}/${containerName}:node-${matrix.node-version}-latest`,
        // `${containerRegistry}/${containerName}:node-${matrix.node-version}-d-${needs.Setup.outputs.Date}`,
        // `${containerRegistry}/${containerName}:node-${matrix.node-version}-b-${needs.Setup.outputs.Branch}`,
        // `${containerRegistry}/${containerName}:node-${matrix.node-version}-c-${needs.Setup.outputs.ShaHash}`,  
    ]

    this
      .add('dockerfile', {
        hasDockerfile,
        hasDockerignore,
        tags,
        tagsAsString: tags.join(', '),
      })
  }
}
