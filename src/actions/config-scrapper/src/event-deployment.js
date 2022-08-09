const github = require("@actions/github");

const { templateInfo } = require('../log')

module.exports = async (analysis) => {
  if (github.context.payload.deployment) {
    const environment = github.context.payload.deployment.environment
    templateInfo('e.deployment', `detected environment = ${environment}`)

    analysis.environment = environment
    analysis.outputs.environment = environment
  }
}
