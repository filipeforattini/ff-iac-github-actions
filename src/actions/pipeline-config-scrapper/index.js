const _ = require("lodash");
const path = require("path");
const core = require("@actions/core");
const glob = require("@actions/glob");
const linguist = require("linguist-js");
const github = require("@actions/github");

const scrappers = require('./src')

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

  const analysis = {};
  analysis.root = process.cwd();

  await scrappers.code(analysis)
  await scrappers.git(analysis)
  await scrappers.run(analysis)

  core.info(JSON.stringify(languages, null, 2));
  core.setOutput("actor", github.context.actor);

  analysis.languages = languages;
  analysis.actor = github.context.actor;

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
