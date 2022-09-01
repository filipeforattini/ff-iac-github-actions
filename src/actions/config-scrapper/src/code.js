const _ = require("lodash");
const linguist = require("linguist-js");

const logger = require('../log')

const LanguagesToOmit = ["Makefile"];
const languagesRouter = {
  typescript: "javascript",
  tsx: "javascript",
};

module.exports = async (analysis) => {
  logger.info("code", `starting linguist analyzer`)

  let { languages } = await linguist(analysis.root, {
    // categories: ["programming"],
    // ignoredLanguages: ["Shell", "Dockerfile"],
  });

  languages = _.omit(languages.results, LanguagesToOmit)
  analysis.code.languages = languages;

  let langIterator = _.mapValues(languages, "bytes");
  langIterator = _.toPairs(langIterator);
  langIterator = langIterator.map((z) => _.zipObject(["language", "bytes"], z));
  langIterator = _.sortBy(langIterator, "bytes");

  if (langIterator.length == 0) {
    analysis.language = 'undetected';
    analysis.outputs.language = analysis.language;
    return
  }

  let language = langIterator.pop().language;
  language = language.toLowerCase();

  logger.info("code", `language ${language} detected!`)

  if (languagesRouter[language]) {
    language = languagesRouter[language];
    logger.info("code", `language routed to ${language}!`)
  }

  analysis.language = language;
  analysis.outputs.language = analysis.language;
};
