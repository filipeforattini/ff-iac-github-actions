const git = require('./src/git')

module.exports = ({ github, context }) => console.log(JSON.stringify({
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
    firstName: context.payload.head_commit.commiter.split(' ').shift(),
    messages: context.payload.commits.map(c => c.message),
  },

  // pipeline related
  config: {
    type: 'service',
  }
}))
