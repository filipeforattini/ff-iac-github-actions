const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Code extends Scrapper {
  setup () {
    const isNode = fs.existsSync(path.join(process.cwd(), 'package.json'))
      ? true
      : false

    const isPython = fs.existsSync(path.join(process.cwd(), 'requirements.txt'))
      ? true
      : false

    this
      .add('code', {
        isNode,
        isPython
      })
  }
}
