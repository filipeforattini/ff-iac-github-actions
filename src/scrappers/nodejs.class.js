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

    const entrypoint = '[ "npm" ]'
    const command = '[ "start" ]'
    const dockerignore = ['node_modules']

    const dependencyCommand = hasYarnLock 
      ? 'yarn install' 
      : hasPackageLock 
        ? 'npm ci' 
        : 'npm install'

    const cacheKey = hasYarnLock 
      ? 'yarn.lock' 
      : hasPackageLock 
        ? 'package-lock.json' 
        : 'package.json'

    this
      .add('code', {
        cacheKey,
        dependencyCommand,
      })
      .add('nodejs', {
        cacheKey,
        hasYarnLock,
        hasPackageLock,
        dependencyCommand,
      })
      .add('dockerfile', {
        entrypoint,
        command,
        dockerignore,
        dependencyCommand,
      })
  }
}
