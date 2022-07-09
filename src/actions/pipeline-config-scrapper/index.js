const _ = require("lodash");
const core = require("@actions/core");
const github = require("@actions/github");
const linguist = require("linguist-js");

const {
  Git, 
  Run, 
  Code, 
  Deploy,
  Docker,
  Nodejs,
  Python,
} = require('./src')

try {
  let providers = [ Git, Run, Code ]
  let output = {}
  let args = github.context
  core.info("context", JSON.stringify(github.context, null, 2));

  output = providers
    .map(p => p.load(args, output))
    .reduce((acc, i) => _.merge(acc, i.data), {})

  if (output.code.isNode) providers = [ Nodejs ]
  if (output.code.isPython) providers = [ Python ]

  output = providers
    .map(p => p.load(args, output))
    .reduce((acc, i) => _.merge(acc, i.data), output)

  providers = [ Docker, Deploy ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => _.merge(acc, i.data), output)

  core.setOutput("config", JSON.stringify(output));

  const { languages } = linguist(process.cwd(), {
    categories: ["programming"],
  });

  console.log(`languages: ${JSON.stringify(languages, null, 2)}`);

  core.setOutput("language", languages);
  const payload = JSON.stringify(github.context, undefined, 2);

  console.log(`The event payload: ${payload}`);
} catch (error) {

  core.setFailed(error.message);
}
