const _ = require("lodash");
const core = require("@actions/core");
const linguist = require("linguist-js");

const { templateInfo } = require('../log')

module.exports = async (analysis) => {
  const { languages } = await linguist(analysis.root, {
    categories: [ "programming" ],
    ignoredLanguages: [ "Shell", "Dockerfile" ],
  });

  let langIterator = _.mapValues(languages.results, "bytes");
  langIterator = _.toPairs(langIterator);
  langIterator = langIterator.map((z) => _.zipObject(["language", "bytes"], z));
  langIterator = _.sortBy(langIterator, "bytes");

  if (langIterator.length == 0) return core.warning(templateInfo('code', "no language detected"));

  const language = langIterator.pop().language;
  core.info(templateInfo('code', `language ${language} detected!`));
  analysis.language = language.toLowerCase();

  analysis.outputs.language = analysis.language
};
