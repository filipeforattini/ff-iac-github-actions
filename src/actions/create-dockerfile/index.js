const fs = require("fs");
const _ = require('lodash');
const path = require("path");
const core = require("@actions/core");

const stubs = require('./stubs')

async function action() {
  let preset = core.getInput('preset', { required: true })

  if (!stubs[preset]) core.error(new Error('preset doesnt exists'))

  const { defaultValues, files = {}, stub } = stubs[preset]

  for (const filename of _.keys(files)) {
    fs.writeFileSync(path.join(process.cwd(), filename), files[filename]);
  }

  const template = _.template(stub)

  const content = template({ 
    generatedAt: new Date().toISOString(),
    ...defaultValues,
  });

  fs.writeFileSync(path.join(process.cwd(), "Dockerignore"), content);
  core.warning(`content = ${content}`)
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
