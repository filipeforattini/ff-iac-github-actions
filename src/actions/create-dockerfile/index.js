const fs = require("fs");
const qs = require("qs");
const _ = require("lodash");
const path = require("path");
const core = require("@actions/core");

const stubs = require("./stubs");

const encode = (obj) => qs.stringify(obj, { arrayFormat: "brackets" });
const decode = (str) => qs.parse(str);

async function action() {
  let preset = core.getInput("preset", { required: true });
  let writeSummary = core.getBooleanInput("writeSummary", { required: true });

  if (!stubs[preset]) core.error(new Error(`preset "${preset}" doesnt exist`));

  let { defaultValues, files = {}, stub } = stubs[preset];

  for (const filename of _.keys(files)) {
    fs.writeFileSync(path.join(process.cwd(), filename), files[filename]);
  }

  const template = _.template(stub);

  defaultValues = _.mapValues(defaultValues, (v) => _.isFunction(v) ? v() : v)

  const data = _.merge(
    defaultValues,
    decode(
      [
        encode({
          generatedAt: new Date().toISOString(),
          ...defaultValues,
        }),
        encode({
          labels: [],
          environmentVariables: [],
        }),
      ].join("&")
    )
  );

  const content = template(data);

  fs.writeFileSync(path.join(process.cwd(), "Dockerfile"), content);

  if (writeSummary) {
    await core.summary
      .addHeading("📦 Deploy", 3)
      .addEOL()
      .addRaw(
        [
          "<details><summary>Dockerfile:</summary>\n\n```dockerfile \n",
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
