const fs = require("fs");
const path = require("path");

module.exports = function ({ defaultBranch = "master", files = [], npmPlugin = false }) {
  let plugins = [];
  console.log({plugins})

  plugins = plugins.concat([
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
  ]);
  
  console.log({plugins})

  if (npmPlugin) plugins = plugins.concat([[
    "@semantic-release/npm",
    {
      npmPublish: false,
    },
  ]]);

  console.log({plugins})
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
        assets: ["dist/**/*.{js,css,py}", ...files],
      },
    ],
  ]);

  console.log({plugins})

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

  console.log(releaseFile)

  fs.writeFileSync(path.join(process.cwd(), ".releaserc.json"), releaseFile);

  return releaseFile;
};
