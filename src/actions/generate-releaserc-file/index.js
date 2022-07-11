const fs = require("fs");
const path = require("path");
const core = require("@actions/core");

async function action() {  
  let defaultBranch = core.getInput('defaultBranch', { required: true });
  let files = core.getMultilineInput('files', { required: true })
  let npmPlugin = core.getBooleanInput('npmPlugin', { required: true });

  let plugins = [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
  ]

  if (npmPlugin) plugins = plugins.concat([[
    "@semantic-release/npm",
    {
      npmPublish: false,
    },
  ]]);

  plugins = plugins.concat([
    [
      "@semantic-release/git",
      {
        assets: ["docs", "README.md", "CHANGELOG.md", ...files],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [...files],
      },
    ],
  ]);

  let releaseFile = {
    defaultBranch,
    branches: [
      // tags
      "+([0-9])?(.{+([0-9]),x}).x",

      // default branch
      defaultBranch,

      // alpha
      "next",
      "next-major",
      { name: "beta", prerelease: true },
      { name: "alpha", prerelease: true },

      // git-flow
      "bug/*",
      "bugfix/*",
      "release/*",
      "feature/*",
    ],
    plugins,
  };

  releaseFile = JSON.stringify(releaseFile, null, 2);

  fs.writeFileSync(path.join(process.cwd(), ".releaserc.json"), releaseFile);
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}