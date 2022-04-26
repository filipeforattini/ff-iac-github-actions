const fs = require("fs");
const path = require("path");

module.exports = function ({ files = [] } = {}) {
  let releaseFile = {
    branches: [
      // tags
      "+([0-9])?(.{+([0-9]),x}).x",

      // production
      "main",
      "master",

      // alpha
      "next",
      "next-major",
      {
        name: "beta",
        prerelease: true,
      },
      {
        name: "alpha",
        prerelease: true,
      },

      // git-flow
      "bug/*",
      "bugfix/*",
      "release/*",
      "feature/*",
    ],
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      [
        "@semantic-release/git",
        {
          assets: [
            "dist/**/*.{js,css,py}",
            "docs",
            "readme.md",
            "changelog.md",
            ...files,
          ],
          message:
            "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        },
      ],
      [
        "@semantic-release/github",
        {
          assets: [
            "dist/**/*.{js,css,py}",
            ...files,
          ],
        },
      ],
    ],
  };

  releaseFile = JSON.stringify(releaseFile, null, 2);

  fs.writeFileSync(path.join(process.cwd(), ".releaserc.json"), releaseFile);

  return releaseFile;
};