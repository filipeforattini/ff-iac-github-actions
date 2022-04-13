const git = require('./src/git')

module.exports = ({ github, context }) => console.log({
  githubJson: JSON.stringify(github),
  contextJson: JSON.stringify(context),

  // git related
  fromRepository: {
    branch: git.branch(),
    commit: git.commitSha(),
  },

  fromContext: {
    branch: context.ref.replace('/refs/heads/', ''),
    commit: context.sha.substring(0, 7),
  },

  // run related
  run: {
    id: context.runId,
    count: context.runNumber,
    event: context.eventName,
    repository: context.workflow,
  },
  
  // time related
  time: {
    timestamp: Date.now(),
    date: new Date().toISOString().substring(0, 10),
  },
})
