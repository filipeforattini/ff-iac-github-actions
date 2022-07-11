const _ = require('lodash')
const core = require("@actions/core");
const github = require("@actions/github");

const scrappers = require("./src");

const analysisFactory = (initial = {}) => new Proxy(initial, {
  get(target, prop, receiver) {
    if (!target[prop]) target[prop] = {}
    return target[prop]
  },

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
        " \n\n ```</details>",
      ].join('\n'),
      true
    )
    .write();

  const analysis = analysisFactory({
    root: process.cwd(),
    actor: github.context.actor,
    outputs: {},
  })
  
  analysis.outputs.actor = github.context.actor

  await scrappers.code(analysis);
  await scrappers.git(analysis);
  await scrappers.repository(analysis);
  await scrappers.run(analysis);
  
  Object.entries(analysis.outputs)
    .forEach(([key, value]) => {
      core.setOutput(key, _.isObject(value) ? JSON.stringify(analysis, null, 2) : value);
    })
  
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

  core.summary.addTable(Object.entries(analysis.outputs)).write()
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
