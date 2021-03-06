const fs = require('fs')
const path = require('path')


module.exports = {
  stub: `
# This file was autogenerated at <%= generatedAt %>.
FROM <%= image %>:<%= tag %>

<% labels.length && print("LABEL " + labels.join(' \\\n\t')) %>

<% environmentVariables.length && print("ENV "+ environmentVariables.join(' \\\n\t')) %>

WORKDIR /svc
COPY . /svc

RUN <%= dependencyCommand %>

ENTRYPOINT ["<%= entrypoint %>"]
CMD ["<%= command %>"]
`,

  defaultValues: {
    image: "node",
    tag: "17-alpine",
    labels: ["builder=pipeline"],
    environmentVariables: ["OS=Alpine"],
    dependencyCommand: () => {
      return fs.existsSync(path.join(process.cwd(), 'package-lock.json'))
        ? "npm install"
        : fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
          ? "yarn"
          : "npm install"
    },
    entrypoint: "npm",
    command: "start",
  },

  files: [],
};
