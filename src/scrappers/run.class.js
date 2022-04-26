const Scrapper =  require('./scrapper.class')

module.exports = class Run extends Scrapper {
  setup () {
    this
      .add('run', {
        id: this.context.runId,
        stepTimestamp: Date.now(),
        count: this.context.runNumber,
        event: this.context.eventName,
        date: this.context.payload.head_commit.timestamp.substring(0, 10),
        startTimestamp: new Date(this.context.payload.head_commit.timestamp).getTime(),
      })
  }
}
