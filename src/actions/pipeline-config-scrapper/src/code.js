const core = require("@actions/core");
const linguist = require("linguist-js");

module.exports = async (analysis) => {
  const { languages } = await linguist(analysis.root, {
    categories: ["programming"],
    ignoredLanguages: ["Shell", "Dockerfile"],
  });

  core.info(JSON.stringify(languages, null, 2));

  analysis.languages = languages;
}
