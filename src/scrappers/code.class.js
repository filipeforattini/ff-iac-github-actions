const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Code extends Scrapper {
  setup () {
    const isNode = fs.existsSync(path.join(process.cwd(), 'package.json'))
    const isPython = fs.existsSync(path.join(process.cwd(), 'requirements.txt'))

    const language = isNode ? 'node' : isPython ? 'python' : 'unknown'

    this
      .add('code', {
        isNode,
        isPython,
        language,
      })
  }
}
