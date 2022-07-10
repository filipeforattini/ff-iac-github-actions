const _ = require("lodash");
const core = require("@actions/core");
const github = require("@actions/github");
const linguist = require("linguist-js");
const glob = require("@actions/glob");

async function action() {
  await core.summary
    .addHeading("🔍 Analized", 3)
    .addRaw(["<details><summary>Received context:</summary>\n\n```json \n", JSON.stringify(github.context, null, 2), " \n```\n</details>"].join(''), true)
    .write();

  const languages = linguist(process.cwd(), {
    categories: ["programming"],
    ignoredLanguages: ["Shell", "Dockerfile"],
  });

  const globber = await glob.create("**", { followSymbolicLinks: false });
  const files = await globber.glob();
  const analysis = {};

  core.info(JSON.stringify(languages, null, 2));
  core.setOutput("actor", github.context.actor);

  analysis.root = process.cwd();
  analysis.languages = languages;
  analysis.actor = github.context.actor;
  analysis.files = files;

  await core.summary
    .addRaw(["<details><summary>Analysis:</summary>\n\n```json \n", JSON.stringify(analysis, null, 2)," \n```\n</details>"].join(''), true)
    .write();
}

try {
  action();

  // let providers = [ Git, Run, Code ]
  // let output = {}
  // let args = github.context

  // output = providers
  //   .map(p => p.load(args, output))
  //   .reduce((acc, i) => _.merge(acc, i.data), {})

  // if (output.code.isNode) providers = [ Nodejs ]
  // if (output.code.isPython) providers = [ Python ]

  // output = providers
  //   .map(p => p.load(args, output))
  //   .reduce((acc, i) => _.merge(acc, i.data), output)

  // providers = [ Docker, Deploy ]

  // output = providers.map(p => p.load(args, output))
  //   .reduce((acc, i) => _.merge(acc, i.data), output)

  // core.setOutput("config", JSON.stringify(output));

  // const { languages } = linguist(process.cwd(), {
  //   categories: ["programming"],
  // });

  // console.log(`languages: ${JSON.stringify(languages, null, 2)}`);

  // core.setOutput("language", languages);
  // const payload = JSON.stringify(github.context, undefined, 2);

  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error);
}
