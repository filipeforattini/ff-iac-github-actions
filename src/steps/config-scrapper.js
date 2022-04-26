const mergeDeep = require('../merge-deep')
const { 
  Git, 
  Run, 
  Code, 
  Deploy,
  Docker,
  Nodejs,
  Python,
} = require('../scrappers')

module.exports = function ConfigScrapper (args) {
  let providers = [ Git, Run, Code ]
  let output = {}

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), {})
  
  if (output.code.isNode) providers = [ Nodejs ]
  if (output.code.isPython) providers = [ Python ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), output)
  
  providers = [ Docker, Deploy ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), output)

  return JSON.stringify(output)
}
