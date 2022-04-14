module.exports = class Template {
  constructor ({ stub }) {
    this.stub = stub
  }

  render (data) {
    return this.stub.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }
}
