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

  fs.writeFileSync(path.join(process.cwd(), "Dockerfile"), content);

  if (!fs.existsSync(path.join(process.cwd(), "Dockerfile")))
    throw "File was not created."

  let writeSummary = core.getBooleanInput('writeSummary', { required: true });

  if (writeSummary) {
    await core.summary
      .addHeading("📦 Deploy", 3)
      .addEOL()
      .addRaw(
        [
          "<details><summary>Dockerfile:</summary>\n\n```dockerfile \n",
          content,
          " \n\n ``` \n</details>",
        ].join(''),
        true
        )
      .write();
  }
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
