const Scrapper =  require('./scrapper.class')

module.exports = class Run extends Scrapper {
  setup () {
    this
      .add('run', {
        id: this.context.runId,
        jobTimestamp: Date.now(),
        count: this.context.runNumber,
        event: this.context.eventName,
        date: this.context.payload.head_commit.timestamp.substring(0, 10),
        startedAt: new Date(this.context.payload.head_commit.timestamp).toISOString(),
        startTimestamp: new Date(this.context.payload.head_commit.timestamp).getTime(),
      })
  }
}
