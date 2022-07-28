const fs = require("fs");
const path = require("path");
const github = require("@actions/github");

module.exports = async (analysis) => {
  const [organization, name] = github.context.payload.repository.full_name.split("/");

  let [ecosystem, type, ...client] = name.split("-");
  client = client.join('-'),

  analysis.repository = {
    name,
    organization,
    fullname: github.context.payload.repository.full_name,
    ecosystem,
    type,
    client
  };

  analysis.features = {
    hasReleaseRC: fs.existsSync(path.join(analysis.root, ".releaserc.json")),
    hasDockerfile: fs.existsSync(path.join(analysis.root, "Dockerfile")),
    hasDockerignore: fs.existsSync(path.join(analysis.root, ".dockerignore")),
  };

  // outputs
  analysis.outputs.ecosystem = analysis.repository.ecosystem;
  analysis.outputs.repository = analysis.repository.name;
  analysis.outputs.organization = analysis.repository.organization;
  analysis.outputs.feature_has_releaserc = analysis.features.hasReleaseRC;
  analysis.outputs.feature_has_dockerfile = analysis.features.hasDockerfile;
  analysis.outputs.feature_has_dockerignore = analysis.features.hasDockerignore;
};
