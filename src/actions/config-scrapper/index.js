const _ = require('lodash')
const core = require("@actions/core");
const github = require("@actions/github");

const logger = require('./log')
const scrappers = require("./src");
const { templateInfo, templateDetails } = require('./templates')

const analysisFactory = (initial = {}) => new Proxy(initial, {
  get(target, prop) {
    if (!target[prop]) target[prop] = {}
    return target[prop]
  },

  set(obj, prop, value) {
    if (_.isString(value)) obj[prop] = prop

    if (!obj[prop]) obj[prop] = {}
    
    obj[prop] = _.isObject(value)
      ? _.merge(obj[prop], value)
      : value
  }
})

async function action() {
  logger.info('system', `project root dir: ${process.cwd()}`)

  let writeSummary = core.getBooleanInput('writeSummary', { required: true });

  if (writeSummary) {
    await core.summary
      .addHeading("🔍 Analyzed", 3)
      .addEOL()
      .addRaw('This step will read your repository and seak for features to aggregate value!', true)
      .addRaw(
        templateDetails({ 
          summary: 'Received context:',
          content: JSON.stringify(github.context, null, 2), 
        }),
        true
      )
      .write();
  }

  const evaluateSecrets = core.getBooleanInput('evaluateSecrets');

  if (evaluateSecrets) {
    const pipelineSecrets = [
      'PIPESECRET_KUBE_CONFIG',
      'PIPESECRET_REGISTRY_PASSWORD',
      'PIPESECRET_REGISTRY_USERNAME',
      'PIPESECRET_PIPELINE_DEPLOY_TOKEN',
    ]
    .reduce((acc, s) => { 
      let value = process.env[s] || ''
      let friendlyName = s.replace('PIPESECRET_', '')
      
      value.length > 0
        ? logger.info('secret', `${friendlyName} is definied.`)
        : logger.info('secret', `${friendlyName} is [not] definied.`)

      acc[friendlyName] = !_.isEmpty(value)
      return acc
    }, {})

    await core.summary
      .addRaw('Secrets analysis')
      .addTable([
        [{ data: 'secret', header: true }, { data: 'defined', header: true }],
        ...Object.entries(pipelineSecrets).map(([key, value]) => [ key, `${value}`]),
      ])
      .write()

    if (!Object.values(pipelineSecrets).every(x => x)) {
      core.setFailed(new Error('There are non-defined secrets. Please configure your repository with the secrets below in the summary.'));
    }
  }


  const analysis = analysisFactory({
    root: process.cwd(),
    actor: github.context.actor,
    event: github.context.eventName,
    environment: 'dev',
    outputs: {},
  })
  
  logger.info('system', `run trigged by [${analysis.event}] event`)
  analysis.outputs.pwd = analysis.root
  analysis.outputs.event = analysis.event
  analysis.outputs.actor = github.context.actor
  analysis.outputs.environment = 'dev'

  if (analysis.event === 'workflow_dispatch') {
    await scrappers.eventDispatch(analysis)
  } else if (analysis.event === 'deployment') {
    await scrappers.eventDeployment(analysis)
  }

  await Promise.all([
    scrappers.git(analysis),
    scrappers.run(analysis),
    scrappers.code(analysis),
    scrappers.deploy(analysis),
    scrappers.repository(analysis),
  ])
  
  Object.entries(analysis.outputs)
    .forEach(([key, value]) => {
      core.setOutput(key, _.isObject(value) ? JSON.stringify(analysis, null, 2) : `${value}`);
    })
  
  if (writeSummary) {
    await core.summary
      .addRaw(
        templateDetails({ 
          summary: 'Analysis:',
          content: JSON.stringify(analysis, null, 2), 
        }),
        true
      )
      .addHeading('Outputs:', 4)
      .addTable([
        [{ data: 'key', header: true }, { data: 'value', header: true }],
        ..._.sortBy(Object.entries(analysis.outputs), '[0]').map(([key, value]) => [ key, `${value}`]),
      ])
      .write()
  }
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
