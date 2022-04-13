const Scrapper = require('./scrapper.class')

module.exports = class Python extends Scrapper {
  setup () {
    const startCommand = 'python app.py'
    const dependencyCommand = 'pip install -r requirements.txt'
    const dockerignore = ['']

    this
      .add('python', {
        startCommand,
        dependencyCommand,
      })
      .add('dockerfile', {
        startCommand,
        dockerignore,
        dependencyCommand,
      })
  }
}
