const Scrapper = require('./scrapper.class')

module.exports = class Helm extends Scrapper {
  setup () {
    const repository = this.context.payload.repository.full_name

    const pipeline = repository.includes('-svc-')
      ? 'svc'
      : repository.includes('-app-')
        ? 'app'
        : repository.includes('-iac-')
          ? 'iac'
          : 'unknown'

    this
      .add('helm', {
        pipeline,
        pod: pipeline,
        namespace: repository,
      })
  }
}
