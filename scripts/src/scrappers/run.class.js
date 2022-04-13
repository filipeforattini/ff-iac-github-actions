const Scrapper =  require('./scrapper.class')

module.exports = class Run extends Scrapper {
  setup () {
    this
      .add('time', {
        stepTimestamp: Date.now(),
        date: this.context.payload.head_commit.timestamp.substring(0, 10),
        timestamp: new Date(this.context.payload.head_commit.timestamp).getTime(),
      })
      .add('run', {
        id: this.context.runId,
        count: this.context.runNumber,
        event: this.context.eventName,
        repository: this.context.workflow,
      })
  }
}
