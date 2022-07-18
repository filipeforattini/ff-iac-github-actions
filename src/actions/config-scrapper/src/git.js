const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  if (github.context.payload.head_commit) {
    analysis.commiter = { ...github.context.payload.head_commit.committer}

    analysis.outputs.commiter_name = analysis.commiter.name
    analysis.outputs.commiter_email = analysis.commiter.email
    analysis.outputs.commiter_username = analysis.commiter.username
  }

  // outputs
  analysis.outputs.event = analysis.event
}
