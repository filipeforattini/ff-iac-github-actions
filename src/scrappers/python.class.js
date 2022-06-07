const Scrapper = require('./scrapper.class')

module.exports = class Python extends Scrapper {
  setup () {
    const entrypoint = [ "python" ]
    const command = [ "app.py" ]
    const dockerignore = ['']
    const dependencyCommand = ['pip install --no-cache-dir -r requirements.txt']
    const dockerDependency = [ dependencyCommand ]
    
    this
      .add('code', {
        dependencyCommand,
      })
      .add('python', {
        dependencyCommand,
      })
      .add('dockerfile', {
        dockerignore,
        entrypoint: JSON.stringify(entrypoint),
        command: JSON.stringify(command),
        dependencyCommand: JSON.stringify(dockerDependency),
      })
      .add('python', {
        version: '0.0.1',
      })
  }
}
