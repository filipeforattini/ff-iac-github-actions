const fs = require('fs')
const path = require('path')
const Scrapper = require('./scrapper.class')

module.exports = class Code extends Scrapper {
  setup () {
    const isNode = fs.existsSync(path.join(process.pwd(), 'package.json'))
      ? true
      : false

    const isPython = fs.existsSync(path.join(process.pwd(), 'requirements.txt'))
      ? true
      : false

    this
      .add('code', {
        isNode,
        isPython
      })
  }
}
