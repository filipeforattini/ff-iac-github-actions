const _ = require('lodash')
const core = require("@actions/core");
const github = require("@actions/github");

const scrappers = require("./src");

const analysisFactory = (initial = {}) => new Proxy(initial, {
  set(obj, prop, value) {
    if (!obj[prop]) obj[prop] = {}
    
    obj[prop] = _.isObject(value)
      ? _.merge(obj[prop], value)
      : value
  }
})

async function action() {
  await core.summary
    .addHeading("🔍 Analized", 3)
    .addRaw(
      [
        "<details><summary>Received context:</summary>\n\n```json \n",
        JSON.stringify(github.context, null, 2),
        " \n```\n</details>",
      ].join(""),
      true
    )
    .write();

  const analysis = analysisFactory({
    root: process.cwd(),
    actor: github.context.actor,
  })

  await scrappers.code(analysis);
  await scrappers.git(analysis);
  await scrappers.repository(analysis);
  await scrappers.run(analysis);

  core.setOutput("event", analysis.event);
  core.setOutput("analysis", JSON.stringify(analysis, null, 2));

  await core.summary
    .addRaw(
      [
        "<details><summary>Analysis:</summary>\n\n```json \n",
        JSON.stringify(analysis, null, 2),
        " \n```\n</details>",
      ].join(""),
      true
    )
    .write();
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
