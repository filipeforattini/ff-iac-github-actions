const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Nodejs extends Scrapper {
  setup () {
    const hasPackageLock = fs.existsSync(path.join(process.cwd(), 'package-lock.json'))
      ? true
      : false

    const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
      ? true
      : false

    const startCommand = 'node app.js'
    const dependencyCommand = hasYarnLock 
      ? 'yarn install' 
      : hasPackageLock 
        ? 'npm ci' 
        : 'npm install'

    this
      .add('nodejs', {
        hasYarnLock,
        hasPackageLock,
        startCommand,
        dependencyCommand,
      })
      .add('dockerfile', {
        startCommand,
        dependencyCommand,
      })
  }
}
