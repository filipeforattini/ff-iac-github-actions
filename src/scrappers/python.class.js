const Scrapper = require('./scrapper.class')

module.exports = class Python extends Scrapper {
  setup () {
    const entrypoint = '[ "python" ]'
    const command = '[ "app.py" ]'
    const dockerignore = ['']
    const dependencyCommand = 'pip install -r requirements.txt'

    this
      .add('python', {
        dependencyCommand,
      })
      .add('dockerfile', {
        entrypoint,
        command,
        dockerignore,
        dependencyCommand,
      })
  }
}
