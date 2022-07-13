const github = require("@actions/github");

module.exports = async (analysis) => {
  if (github.context.payload.deployment) {
    analysis.environment = github.context.payload.deployment.environment
    analysis.outputs.environment = analysis.environment
  }
}
