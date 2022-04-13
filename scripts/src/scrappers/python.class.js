const Scrapper = require('./scrapper.class')

module.exports = class Python extends Scrapper {
  setup () {
    const startCommand = 'python app.py'
    const dependencyCommand = 'pip install -r requirements.txt'

    this
      .add('python', {
        startCommand,
        dependencyCommand,
      })
      .add('dockerfile', {
        startCommand,
        dependencyCommand,
      })
  }
}
