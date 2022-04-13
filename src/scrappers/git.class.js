const thread = require('child_process')
const Scrapper = require('./scrapper.class')

module.exports = class Git extends Scrapper {
  setup () {
    const commit = this.context.sha.substring(0, 7)
    const branch = this.context.ref.replace('refs/heads/', '')

    // console.log('AQUIIII =', JSON.stringify(this.context.payload.head_commit))

    const [ firstName, ...surnames ] = this.context.payload.head_commit.committer.name.split(' ')

    this
      .add('git', {
        branch,
        commit,
        repository: this.context.payload.repository.name,
        
        fromContext: {
          commit,
          branch,
        },
    
        fromRepository: {
          commit: this.getCommitShaFromRepository(),
          branch: this.getBranchFromRepository(),
        },

        actor: {
          ...this.context.payload.head_commit.committer,
          messages: this.context.payload.commits.map(c => c.message),
          firstName,
          lastName: surnames.pop(),
        }
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
