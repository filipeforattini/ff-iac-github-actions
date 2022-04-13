const mergeDeep = require('../merge-deep')

module.exports = class Scrapper {
  constructor ({ github, context, inputs, core, glob, io, exec }, output) {
    this.io = io
    this.core = core
    this.exec = exec
    this.glob = glob
    this.inputs = inputs
    this.github = github
    this.output = output
    this.context = context

    this.data = {}
  }

  static load (...args) {
    const instance = new this(...args)
    instance.setup()
    return instance
  }

  add (key, data) {
    this.data[key] = mergeDeep(
      this.data[key] || {},
      data
    )

    return this
  }

  // overwrite
  setup () {}
}
