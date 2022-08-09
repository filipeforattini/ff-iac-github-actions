const github = require("@actions/github");

module.exports = async (analysis) => {
  let { environment } = github.context.payload

  analysis.environment = environment
  analysis.outputs.environment = environment
}
