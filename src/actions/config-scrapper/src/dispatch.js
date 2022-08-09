const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  let environment = core.getInput('environment', { required: true });
  analysis.environment = environment
  analysis.outputs.environment = environment
}
