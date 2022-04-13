const mergeDeep = require('../merge-deep')
const { 
  Git, 
  Run, 
  Helm,
  Code, 
  Nodejs,
  Python,
  Dockerfile,
} = require('../scrappers')

module.exports = function Setup (args) {
  let providers = [ Git, Run, Code ]
  let output = {}

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), {})
  
  if (output.code.isNode) providers = [ Nodejs ]
  if (output.code.isPython) providers = [ Python ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), output)
  
  providers = [ Helm, Dockerfile ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), output)

  return JSON.stringify(output)
}
