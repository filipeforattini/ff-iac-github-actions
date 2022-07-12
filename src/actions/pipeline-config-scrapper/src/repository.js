const fs = require('fs')
const path = require('path')

module.exports = async (analysis) => {
  analysis.features = {
    hasReleaseRC: fs.existsSync(path.join(analysis.root, '.releaserc.json')),
    hasDockerfile: fs.existsSync(path.join(analysis.root, 'Dockerfile')),
    hasDockerignore: fs.existsSync(path.join(analysis.root, '.dockerignore')),
  }

  analysis.outputs.feature_has_releaserc = analysis.features.hasReleaseRC
  analysis.outputs.feature_has_dockerfile = analysis.features.hasDockerfile
  analysis.outputs.feature_has_dockerignore = analysis.features.hasDockerignore
}
