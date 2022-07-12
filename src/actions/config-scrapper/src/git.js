const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  analysis.event = github.context.eventName
  analysis.outputs.event = analysis.event

  core.info(`run trigged by event=${analysis.event}`);

  if (github.context.payload.head_commit) {
    analysis.commiter = { ...github.context.payload.head_commit.committer}

    analysis.outputs.commiter_name = analysis.commiter.name
    analysis.outputs.commiter_email = analysis.commiter.email
    analysis.outputs.commiter_username = analysis.commiter.username
  }
}
