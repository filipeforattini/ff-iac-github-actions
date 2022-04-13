const Scrapper =  require('./scrapper.class')

module.exports = class Run extends Scrapper {
  setup () {
    this
      .add('time', {
        id: this.context.runId,
        stepTimestamp: Date.now(),
        count: this.context.runNumber,
        event: this.context.eventName,
        repository: this.context.workflow,
        date: this.context.payload.head_commit.timestamp.substring(0, 10),
        timestamp: new Date(this.context.payload.head_commit.timestamp).getTime(),
      })
  }
}
