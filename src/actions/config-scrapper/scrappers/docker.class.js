const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Docker extends Scrapper {
  setup () {
    const hasDockerfile = fs.existsSync(path.join(process.cwd(), 'Dockerfile'))
    const hasDockerignore = fs.existsSync(path.join(process.cwd(), '.dockerignore'))

    const containerRegistry = this.inputs.containerRegistry
    const containerName = this.context.payload.repository.full_name

    const imageFullname = `${containerRegistry}/${containerName}`
    const mainImage = `${imageFullname}:c-${this.output.git.commit}`

    let tags = [
      `${imageFullname}:latest`,
      `${imageFullname}:d-${this.output.run.date}`,
      `${imageFullname}:r-${this.output.run.count}`,
      `${imageFullname}:t-${this.output.run.startTimestamp}`,
      `${imageFullname}:b-${this.output.git.branch.replace('/', '-')}`,
      `${imageFullname}:c-${this.output.git.commit}`,
      // `${imageFullName}:node-${matrix.node-version}`,
      // `${imageFullName}:node-${matrix.node-version}-latest`,
      // `${imageFullName}:node-${matrix.node-version}-d-${needs.Setup.outputs.Date}`,
      // `${imageFullName}:node-${matrix.node-version}-b-${needs.Setup.outputs.Branch}`,
      // `${imageFullName}:node-${matrix.node-version}-c-${needs.Setup.outputs.ShaHash}`,  
    ]

    this
      .add('dockerfile', {
        hasDockerfile,
        hasDockerignore,
        imageFullname,
        mainImage,
        tags,
        tagsAsString: tags.join(', '),
      })
  }
}
