const fs = require("fs");
const path = require("path");
const core = require("@actions/core");

async function action() {  
  let defaultBranch = core.getInput('defaultBranch', { required: true });
  let files = JSON.parse(core.getInput('files', { required: false }))
  let npmPlugin = core.getBooleanInput('npmPlugin', { required: false });

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
        assets: ["README.md", "CHANGELOG.md", ...files],
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

  fs.writeFileSync(path.join(process.cwd(), ".releaserc.json"), JSON.stringify(releaseFile, null, 2));

  let x = fs.readFileSync(path.join(process.cwd(), ".releaserc.json"));
}

try {
  action();
} catch (error) {
  core.setFailed(error);
}
