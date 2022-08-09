const github = require("@actions/github");

module.exports = async (analysis) => {
  const environment = github.context.payload.environment

  analysis.environment = environment
  analysis.outputs.environment = environment
}
