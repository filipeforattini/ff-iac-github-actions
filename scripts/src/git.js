const main = require('child_process')

module.exports = {

  commitSha (short = true) {
    return main.execSync(`git rev-parse ${short ? '--short' : ''} HEAD`)
      .toString()
      .trim()
  },

  branch () {
    return main.execSync('git branch --show-current')
      .toString()
      .trim()
  }

}
