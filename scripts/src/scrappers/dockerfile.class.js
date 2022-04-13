const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Dockerfile extends Scrapper {
  setup () {
    const startCommand = 'python app.py'
    const dependencyCommand = 'pip install -r requirements.txt'

    const hasDockerfile = fs.existsSync(path.join(process.pwd(), 'dockerfile'))
      ? true
      : false

    const hasDockerignore = fs.existsSync(path.join(process.pwd(), '.dockerignore'))
      ? true
      : false

    this
      .add('dockerfile', {
        hasDockerfile,
        hasDockerignore,
      })
  }
}
