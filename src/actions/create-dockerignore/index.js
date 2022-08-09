const fs = require("fs");
const _ = require('lodash');
const path = require("path");
const core = require("@actions/core");

const template = _.template(`
# This file was autogenerated at <%= generatedAt %>.
<% _.forEach(globsToIgnore, function(pathy) { %><%- pathy %>\n<% }); %>
`);

async function action() {
  let globsToIgnore = JSON.parse(core.getInput('globsToIgnore', { required: false }))
  let writeSummary = core.getBooleanInput("writeSummary", { required: true });

  const content = template({ 
    generatedAt: new Date().toISOString(),
    'globsToIgnore': [
      '.git',
      '.vscode',
      '.github',
      '.pipeline',
      'manifests',
      ...globsToIgnore,
    ]
  });

  fs.writeFileSync(path.join(process.cwd(), ".dockerignore"), content);

  if (writeSummary) {
    await core.summary
      .addRaw(
        [
          "<details><summary>📝 .dockerignore</summary>\n\n```dockerfile \n",
          content,
          " \n\n ``` \n</details>",
        ].join(""),
        true
      )
      .write();
  }
 
  return content
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}