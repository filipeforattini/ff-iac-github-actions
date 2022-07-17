const github = require("@actions/github");

module.exports = async (analysis) => {
  let containerRegistry = core.getInput('containerRegistry', { required: true });

  const [ organization, name ] = github.context.payload.repository.full_name.split('/')
  const imageFullName = [ containerRegistry, organization, name].join('/')

  if (github.context.payload.deployment) {
    analysis.environment = github.context.payload.deployment.environment
    analysis.outputs.environment = analysis.environment
  }

  analysis.deployment.tags = [
    `${imageFullName}:latest`,
    `${imageFullName}:d-${this.output.run.date}`,
    `${imageFullName}:r-${this.output.run.count}`,
    `${imageFullName}:t-${this.output.run.startTimestamp}`,
    `${imageFullName}:b-${this.output.git.branch.replace('/', '-')}`,
    `${imageFullName}:c-${this.output.git.commit}`,
    // `${imageFullName}:node-${matrix.node-version}`,
    // `${imageFullName}:node-${matrix.node-version}-latest`,
    // `${imageFullName}:node-${matrix.node-version}-d-${needs.Setup.outputs.Date}`,
    // `${imageFullName}:node-${matrix.node-version}-b-${needs.Setup.outputs.Branch}`,
    // `${imageFullName}:node-${matrix.node-version}-c-${needs.Setup.outputs.ShaHash}`,  
  ]
}
