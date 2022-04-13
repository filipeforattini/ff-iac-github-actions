const Scrapper = require('./scrapper.class')

module.exports = class Pipeline extends Scrapper {
  setup () {
    this
      .add('pipeline', {
        type: 'service',
      })
  }
}
