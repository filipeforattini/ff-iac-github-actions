const { templateInfo } = require("./templates");
const core = require("@actions/core");

module.exports = {
  info(context, ...args) {
    core.info(templateInfo('ℹ️', context, ...args));
  },

  warn(context, ...args) {
    core.info(templateInfo('❗', context, ...args));
  },

  error(context, ...args) {
    core.info(templateInfo('⛔', context, ...args));
  },

  debug(context, ...args) {
    core.info(templateInfo('📝', context, ...args));
  },
};
