const github = require("@actions/github");

const { templateInfo } = require('../log')

module.exports = async (analysis) => {
  const { environment } = github.context.payload.inputs
  templateInfo('e.dispatch', `detected environment = ${environment}`)

  analysis.environment = environment
  analysis.outputs.environment = environment
}
