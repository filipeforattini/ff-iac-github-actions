const _ = require("lodash");

module.exports = (initial = {}) =>
  new Proxy(initial, {
    get(target, prop) {
      if (!target[prop]) target[prop] = {};
      return target[prop];
    },

    set(obj, prop, value) {
      if (_.isString(value)) obj[prop] = prop;

      if (!obj[prop]) obj[prop] = {};

      obj[prop] = _.isObject(value) 
        ? _.merge(obj[prop] || {}, value) 
        : value;
      
      return true
    },
  });
