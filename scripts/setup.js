const mergeDeep = require('./src/merge-deep')
const { Git, Run, Pipeline } = require('./src/scrappers')

module.exports = function Setup (...args) {
  const providers = [ Git, Run, Pipeline ]

  const output = providers
    .map(p => p.load(...args))
    .reduce((acc, i) => mergeDeep(acc, i.data), {})

  // console.log(JSON.stringify(output))
  
  return output
}
