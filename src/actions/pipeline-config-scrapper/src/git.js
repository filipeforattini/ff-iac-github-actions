const core = require("@actions/core");
const github = require("@actions/github");

module.exports = async (analysis) => {
  analysis.event = github.context.eventName

  core.info(`this run was trigged by event=${analysis.event}`);
  analysis.outputs.event = analysis.event
}
