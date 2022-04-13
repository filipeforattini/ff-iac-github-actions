const Scrapper = require('./scrapper.class')

module.exports = class Helm extends Scrapper {
  setup () {
    this
      .add('helm', {
        pipeline: 'service',
        name: 'svc',
        namespace: this.context.workflow,
      })
  }
}
