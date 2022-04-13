const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Dockerfile extends Scrapper {
  setup () {
    const hasDockerfile = fs.existsSync(path.join(process.cwd(), 'dockerfile'))
      ? true
      : false

    const hasDockerignore = fs.existsSync(path.join(process.cwd(), '.dockerignore'))
      ? true
      : false

    this
      .add('dockerfile', {
        hasDockerfile,
        hasDockerignore,
        tags: [
          `ghcr.io/${{github.repository}}:latest"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:d-${{needs.Setup.outputs.Date}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:b-${{needs.Setup.outputs.Branch}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:c-${{needs.Setup.outputs.ShaHash}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:t-${{needs.Setup.outputs.Timestamp}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:node-${{matrix.node-version}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:node-${{matrix.node-version}}-latest"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:node-${{matrix.node-version}}-d-${{needs.Setup.outputs.Date}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:node-${{matrix.node-version}}-b-${{needs.Setup.outputs.Branch}}"
          `${DOCKER_IMAGE_TAGS}, ghcr.io/${{github.repository}}:node-${{matrix.node-version}}-c-${{needs.Setup.outputs.ShaHash}}"  
        ]
      })
  }
}
