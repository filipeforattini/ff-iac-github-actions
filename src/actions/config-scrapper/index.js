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
  let writeSummary = core.getBooleanInput('writeSummary', { required: true });

  if (writeSummary) {
    await core.summary
      .addHeading("🔍 Analized", 3)
      .addEOL()
      .addRaw('This step will read your repository and seak for features to aggregate value!', true)
      .addRaw(
        [
          "<details><summary>Received context:</summary>\n\n```json \n",
          JSON.stringify(github.context, null, 2),
          " \n\n ``` \n</details>",
        ].join(''),
        true
      )
      .write();
  }

  const analysis = analysisFactory({
    root: process.cwd(),
    actor: github.context.actor,
    event: github.context.eventName,
    outputs: {},
  })
  
  core.info(`run trigged by event=${analysis.event}`);
  analysis.outputs.event = analysis.event
  analysis.outputs.actor = github.context.actor

  await Promise.all([
    scrappers.git(analysis),
    scrappers.run(analysis),
    scrappers.code(analysis),
    scrappers.deployment(analysis),
    scrappers.repository(analysis),
  ])
  
  Object.entries(analysis.outputs)
    .forEach(([key, value]) => {
      core.setOutput(key, _.isObject(value) ? JSON.stringify(analysis, null, 2) : `${value}`);
    })
  
  if (writeSummary) {
    await core.summary
      .addRaw(
        [
          "<details><summary>Analysis:</summary>\n\n```json \n",
          JSON.stringify(analysis, null, 2),
          " \n\n ``` \n</details>",
        ].join(''),
        true
      )
      .addHeading('Outputs:', 4)
      .addTable([
        [{ data: 'key', header: true }, { data: 'value', header: true }],
        ...Object.entries(analysis.outputs).map(([key, value]) => [ key, `${value}`]),
      ])
      .write()
  }
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
