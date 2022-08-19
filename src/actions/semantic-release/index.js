const core = require("@actions/core");
const exec = require('@actions/exec');

const {
  GIT_AUTHOR_NAME,
  GIT_AUTHOR_EMAIL,
} = process.env

async function action() {
  core.info(`Analyzing commit from ${GIT_AUTHOR_NAME} <${GIT_AUTHOR_EMAIL}>`);

  let plugins = [
    'semantic-release',
    '@semantic-release/git',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/changelog',
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
  ]
  
  await exec.exec(`npm i -g -D ${plugins.join(' ')}`);
  await exec.exec(`semantic-release`);
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
