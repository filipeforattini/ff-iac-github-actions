const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Nodejs extends Scrapper {
  setup () {
    const { version } = require('package.json')

    const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
    const hasPackageLock = fs.existsSync(path.join(process.cwd(), 'package-lock.json'))

    const entrypoint = [ "npm" ]
    const command = [ "start" ]
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

    const dockerDependency = [ dependencyCommand ]
    if (hasYarnLock) dockerDependency.push('yarn cache clean')

    this
      .add('code', {
        version,
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
        dockerignore,
        entrypoint: JSON.stringify(entrypoint),
        command: JSON.stringify(command),
        dependencyCommand: JSON.stringify(dockerDependency),
      })
      .add('nodejs', {
        version,
      })
  }
}
