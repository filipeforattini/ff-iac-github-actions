const fs = require('fs')
const path = require('path')

module.exports = {
  python: fs.readFileSync(path.join(__dirname, 'python')).toString(),
  javascript: fs.readFileSync(path.join(__dirname, 'javascript')).toString(),
}
