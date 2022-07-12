const core = require("@actions/core");
const exec = require('@actions/exec');

async function action() {  
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
