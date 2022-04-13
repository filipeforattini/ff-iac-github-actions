module.exports = function CacheKey ({ setup, add }) {
  let providers = [ Git, Run, Pipeline, Code ]
  let output = {}

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), {})
  
  if (output.code.isNode) providers = [ Nodejs ]
  if (output.code.isPython) providers = [ Python ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), output)
  
  providers = [ Dockerfile ]

  output = providers.map(p => p.load(args, output))
    .reduce((acc, i) => mergeDeep(acc, i.data), output)

  return JSON.stringify(output)
}
