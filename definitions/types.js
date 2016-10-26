"use strict";

const _ = require("lodash");


/**
 * Type Definitions
 */
module.exports = {

  arguments: {
    is: _.isArguments,
    to (value) {
      if (_.isArray(value)) {
        return (function () { return arguments; }).apply(null, value);
      }
    }
  },

  array: {
    is (value, deep) {
      if (!_.isArray(value)) return false;

      if (deep) {
        if (_.isArray(deep)) {
          return deep.every((d, i) => {
            if (i >= value.length) return false;
            if (d && _.isFunction(d.value)) {
              return !!d.value(value[i]);
            } else if (_.isFunction(d)) {
              return !!d(value[i]);
            } else {
              return false;
            }
          });
        } else if (_.isFunction(deep.value)) {
          return value.every(v => !!deep.value(v));

        } else if (_.isFunction(deep)) {
          return value.every(v => !!deep(v));
        }
      }

      return true;
    },
    to (value, deep) {
      if (_.isArguments(value)) {
        value = Array.prototype.slice.call(value);
      } else {
        value = _.toArray(value);
      }

      if (deep && _.isArray(value)) {
        if (_.isArray(deep)) {
          deep.forEach((d, i) => {
            if (i >= value.length) return;
            if (d && _.isFunction(d.value)) {
              value[i] = d.value(value[i]);
            } else if (_.isFunction(d)) {
              value[i] = d(value[i]);
            }
          });

        } else if (_.isFunction(deep.value)) {
          return value.map(v => deep.value(v));

        } else if (_.isFunction(deep)) {
          return value.map(v => deep(v));
        }
      }

      return value;
    }
  },

  boolean: {
    is: _.isBoolean,
    to (value) {
      let lowerValue = (value + "").toLowerCase();
      if (lowerValue === "t" || lowerValue === "true") return true;
      if (lowerValue === "f" || lowerValue === "false") return false;
      return !!value;
    }
  },

  date: {
    is: _.isDate,
    to (value) {
      //TODO
    }
  },

  element: {
    is: _.isElement,
    to (value) {
      if (_.isString(value)) {
        var div = document.createElement("div");
        div.innerHTML = value;
        return div.firstChild;
      }
    }
  },
  empty: {
    is: _.isEmpty,
    to () {} // Same as toUndefined
  },

  error: {
    is: _.isError,
    to (value) {
      if (_.isString(value)) {
        return new Error(value);
      } else if (_.isObject(value) && value.message) {
        return new Error(value.message, value.fileName, value.lineNumber);
      }
      return new Error("Unknown");
    }
  },

  finite: {
    is: _.isFinite,
    to: _.toFinite
  },

  function: {
    is: _.isFunction,
    to (value, name) {
      if (_.isString(value)) {
        return new Function("return " + "function " + (name || "") + "() { " + value + "; }")();
      } else {
        return _.noop;
      }
    }
  },

  instance: {
    is (value, Clazz) {
      return value instanceof Clazz;
    },
    to (value, Clazz) {
      if (_.isFunction(Clazz)) {
        if (_.isArray(value)) {
          var instance = Object.create(Clazz.prototype);
          Clazz.apply(instance, value);
          return instance;
        } else {
          return new Clazz(value);
        }
      }
    }
  },

  integer: {
    is: _.isInteger,
    to: _.toInteger
  },

  NaN: {
    is: _.isNaN,
    to () {
      return Math.NaN;
    }
  },

  null: {
    is: _.isNull,
    to () {
      return null;
    }
  },

  number: {
    is: _.isNumber,
    to: _.toNumber
  },

  object: {
    is (value, def) {
      if (!_.isObject(value)) return false;

      //{extras: "allow|ignore|reject"}

    },
    to (value, def) {
      //TODO
    }
  },

  plainObject: {
    is: _.isPlainObject,
    to: _.toPlainObject
  },

  regExp: {
    is: _.isRegExp,
    to (value, flags) {
      if (_.isString(value)) {
        return new RegExp(value, _.isString(flags) ? flags : "");
      }
    }
  },

  string: {
    is: _.isString,
    to: _.toString
  },

  undefined: {
    is: _.isUndefined,
    to () {} // returning nothing is the same as undefined
  }

};
