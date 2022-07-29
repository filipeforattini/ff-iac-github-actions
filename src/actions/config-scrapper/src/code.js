const _ = require("lodash");
const core = require("@actions/core");
const linguist = require("linguist-js");

const { templateInfo } = require('../log')

const languagesRouter = {
  typescript: 'javascript',
}

module.exports = async (analysis) => {
  const { languages } = await linguist(analysis.root, {
    categories: [ "programming" ],
    ignoredLanguages: [ "Shell", "Dockerfile" ],
  });

  analysis.code.languages = languages

  let langIterator = _.mapValues(languages.results, "bytes");
  langIterator = _.toPairs(langIterator);
  langIterator = langIterator.map((z) => _.zipObject(["language", "bytes"], z));
  langIterator = _.sortBy(langIterator, "bytes");

  if (langIterator.length == 0) return core.warning(templateInfo('code', "no language detected"));

  let language = langIterator.pop().language;
  analysis.language = language.toLowerCase();

  core.info(templateInfo('code', `language ${language} detected!`));

  if (languagesRouter[language]) {
    language = languagesRouter[language]
    core.info(templateInfo('code', `language routed to ${language}!`));
  }

  analysis.outputs.language = analysis.language
};
