const { Git, Run, Config } = require('./src')

module.exports = function Setup (...args) {
  const providers = [ Git, Run, Config ]

  const output = providers
    .map(p => p.load(...args))
    .reduce((acc, i) => ({ ...acc, ...i.data() }), {})

  console.log(JSON.stringify(output))
  
  return process.exit(0)
}
