const _ = require('lodash')
const core = require('@actions/core');
const github = require('@actions/github');
const linguist = require('linguist-js');

try {
  const { files, languages, unknown } = linguist(folder, options);

  core.setOutput("language", languages);
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
