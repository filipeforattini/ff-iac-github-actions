const fs = require('fs')
const path = require('path')
const thread = require('child_process')
const Scrapper = require('./scrapper.class')

module.exports = class Git extends Scrapper {
  setup () {
    const commit = this.context.sha.substring(0, 7)
    const repository = this.context.payload.repository.name
    const branch = this.context.ref.replace('refs/heads/', '')
    const [ firstName, ...surnames ] = this.context.payload.head_commit.committer.name.split(' ')

    const hasReleaserc = fs.existsSync(path.join(process.cwd(), '.releaserc.json'))
      ? true
      : false

    this
      .add('run', {
        repository
      })
      .add('deploy', {
        namespace: repository
      })
      .add('git', {
        branch,
        commit,
        repository,
        hasReleaserc,
        repositoryFull: this.context.payload.repository.full_name,
        organization: this.context.payload.repository.full_name.split('/')[0],

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
