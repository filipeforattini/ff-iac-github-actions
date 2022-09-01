const github = require("@actions/github");

const logger = require('./log')

module.exports = async (analysis) => {
  const { environment } = github.context.payload.inputs
  logger.info('e.dispatch', `detected environment = ${environment}`)

  analysis.environment = environment
  analysis.outputs.environment = environment
}
