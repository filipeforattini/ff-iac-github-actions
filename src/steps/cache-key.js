module.exports = function CacheKey (args, output) {
  const { code, nodejs, python } = output
  if (code.isNode) return nodejs.cacheKey
  else if (code.isPython) return python.cacheKey
  else new Date().toISOString().substring(0, 10)
}
