const fs = require('fs')
const path = require('path')

module.exports = function (writeFile = true) {
  let releaseFile = {
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      ["@semantic-release/git", {
        "assets": [
          "dist/**/*.{js,css,py}", 
          "docs", 
          "readme.md",
          'changelog.md',
          "package.json",
          "requirements.txt",
        ],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }],
      "@semantic-release/github"
    ],
  }

  releaseFile = JSON.stringify(releaseFile, null, 2)
  
  if (writeFile) {
    fs.writeFileSync(path.join(process.cwd(), '.releaserc.json'), releaseFile)
  }
  
  return releaseFile
}
