const github = require("@actions/github");

const { templateInfo } = require('../log')

module.exports = async (analysis) => {
  const environment = github.context.payload.environment
  templateInfo('e.dispatch', `detected environment = ${environment}`)

  analysis.environment = environment
  analysis.outputs.environment = environment
}
