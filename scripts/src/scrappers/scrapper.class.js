const mergeDeep = require('../merge-deep')

module.exports = class Scrapper {
  constructor ({ github, context, core, glob, io, exec }) {
    this.io = io
    this.core = core
    this.exec = exec
    this.glob = glob
    this.github = github
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
