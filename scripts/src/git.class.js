const thread = require('child_process')
const Scrapper = require('./scrapper.class')

module.exports = class Git extends Scrapper {
  setup () {
    const commit = this.context.sha.substring(0, 7)
    const branch = this.context.ref.replace('refs/heads/', '')

    this
      .add('git', {
        branch,
        commit,
        
        fromContext: {
          commit,
          branch,
        },
    
        fromRepository: {
          branch: this.getBranchFromRepository(),
          commit: this.getCommitShaFromRepository(),
        },
      })
      .add('actor', {
        ...this.context.payload.head_commit.commiter,

        messages: this.context.payload.commits.map(c => c.message),
        lastName: this.context.payload.head_commit.committer.name.split(' ').pop(),
        firstName: this.context.payload.head_commit.committer.name.split(' ').shift(),
      })
  }

  getCommitShaFromRepository (short = true) {
    return thread.execSync(`git rev-parse ${short ? '--short' : ''} HEAD`)
      .toString()
      .trim()
  }

  getBranchFromRepository () {
    return thread.execSync('git branch --show-current')
      .toString()
      .trim()
  }
}
