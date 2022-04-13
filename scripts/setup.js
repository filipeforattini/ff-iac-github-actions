const git = require('./src/git')

module.exports = ({ github, context }) => {
  console.log(JSON.stringify({
    github,
    context,
  }))
    
  return console.log(JSON.stringify({
    // time related
    time: {
      stepTimestamp: Date.now(),
      date: context.payload.head_commit.timestamp.substring(0, 10),
      timestamp: new Date(context.payload.head_commit.timestamp).getTime(),
    },

    // git related
    git: {
      branch: context.ref.replace('refs/heads/', ''),
      commit: context.sha.substring(0, 7),

      fromRepository: {
        branch: git.branch(),
        commit: git.commitSha(),
      },
    
      fromContext: {
        branch: context.ref.replace('refs/heads/', ''),
        commit: context.sha.substring(0, 7),
      },
    },

    // run related
    run: {
      id: context.runId,
      count: context.runNumber,
      event: context.eventName,
      repository: context.workflow,
    },

    // actor related
    actor: {
      ...context.payload.head_commit.commiter,
      messages: context.payload.commits.map(c => c.message),
      lastName: context.payload.head_commit.committer.split(' ').pop(),
      firstName: context.payload.head_commit.committer.split(' ').shift(),
    },

    // pipeline related
    config: {
      type: 'service',
    }
  }))
}
