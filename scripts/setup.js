const git = require('./src/git')

module.exports = ({ github, context }) => console.log({
  github,
  context,

  // git related
  repository: {
    branch: git.branch(),
    commit: git.commitSha(),
  },
  
  // time related
  time: {
    timestamp: Date.now(),
    date: new Date().toISOString().substring(0, 10),
  },
})
