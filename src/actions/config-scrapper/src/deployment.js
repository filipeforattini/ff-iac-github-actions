const github = require("@actions/github");

module.exports = async (analysis) => {
  let containerRegistry = core.getInput('containerRegistry', { required: true });

  if (github.context.payload.deployment) {
    analysis.environment = github.context.payload.deployment.environment
    analysis.outputs.environment = analysis.environment
  }

  analysis.deployment.tags = [
    `${imageFullname}:latest`,
    `${imageFullname}:d-${this.output.run.date}`,
    `${imageFullname}:r-${this.output.run.count}`,
    `${imageFullname}:t-${this.output.run.startTimestamp}`,
    `${imageFullname}:b-${this.output.git.branch.replace('/', '-')}`,
    `${imageFullname}:c-${this.output.git.commit}`,
    // `${imageFullName}:node-${matrix.node-version}`,
    // `${imageFullName}:node-${matrix.node-version}-latest`,
    // `${imageFullName}:node-${matrix.node-version}-d-${needs.Setup.outputs.Date}`,
    // `${imageFullName}:node-${matrix.node-version}-b-${needs.Setup.outputs.Branch}`,
    // `${imageFullName}:node-${matrix.node-version}-c-${needs.Setup.outputs.ShaHash}`,  
  ]
}
