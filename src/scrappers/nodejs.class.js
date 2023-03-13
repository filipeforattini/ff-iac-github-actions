const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Nodejs extends Scrapper {
  setup () {
    const hasPnpmLock = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))
    const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
    const hasPackageLock = fs.existsSync(path.join(process.cwd(), 'package-lock.json'))

    const entrypoint = [ "npm" ]
    const command = [ "start" ]
    const dockerignore = ['node_modules']

    const dependencyCommand = hasPnpmLock
      ? 'pnpm i --frozen-lockfile --force --no-color'
      : hasYarnLock 
        ? 'yarn install --frozen-lockfile --ignore-optional --immutable --network-timeout 1000000' 
        : hasPackageLock 
          ? 'npm ci --force --no-fund --no-audit --maxsockets 1'
          : 'npm install --force'

    const cacheKey = hasPnpmLock
      ? 'pnpm-lock.yaml'
      : hasYarnLock 
        ? 'yarn.lock' 
        : hasPackageLock 
          ? 'package-lock.json' 
          : 'package.json'

    const dockerDependency = [ dependencyCommand ]
    if (hasYarnLock) dockerDependency.push('yarn cache clean')

    this
      .add('code', {
        cacheKey,
        dependencyCommand,
      })
      .add('nodejs', {
        cacheKey,
        hasPnpmLock,
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
  }
}
