const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  if (github.context.eventName === 'workflow_dispatch') {
    let branch = core.getInput('branch', { required: true });
    let environment = core.getInput('environment', { required: true });

    analysis.environment = environment
  }
}
