const _ = require("lodash");
const core = require("@actions/core");
const linguist = require("linguist-js");

const { templateInfo } = require("../log");

const LanguagesToOmit = ["Makefile"];
const languagesRouter = {
  typescript: "javascript",
  tsx: "javascript",
};

module.exports = async (analysis) => {
  let { languages } = await linguist(analysis.root, {
    categories: ["programming"],
    ignoredLanguages: ["Shell", "Dockerfile"],
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

  core.info(templateInfo("code", `language ${language} detected!`));

  if (languagesRouter[language]) {
    language = languagesRouter[language];
    core.info(templateInfo("code", `language routed to ${language}!`));
  }

  analysis.language = language;
  analysis.outputs.language = analysis.language;
};
