const fs = require("fs");
const path = require("path");

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
    image: "python",
    tag: "3.10",
    labels: ["builder=pipeline"],
    environmentVariables: ["OS=Alpine"],
    dependencyCommand: () => {
      return fs.existsSync(path.join(process.cwd(), "makefile"))
        ? "make install"
        : "pip3 install --upgrade -r requirements.txt";
    },
    entrypoint: () => {
      return fs.existsSync(path.join(process.cwd(), "makefile"))
        ? "make"
        : "python";
    },
    command: () => {
      return fs.existsSync(path.join(process.cwd(), "makefile"))
        ? "start"
        : fs.existsSync(path.join(process.cwd(), "app.py"))
          ? "app.py"
          : "";
    },
  },

  files: [],
};
