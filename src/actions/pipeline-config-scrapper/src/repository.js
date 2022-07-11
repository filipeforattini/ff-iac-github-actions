const fs = require('fs')
const path = require('path')

module.exports = async (analysis) => {
  analysis.features = {
    hasReleaseRC: fs.existsSync(path.join(analysis.root, '.releaserc.json'))
  }
}
