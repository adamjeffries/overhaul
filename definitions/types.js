"use strict";

const _ = require("lodash");


/**
 * Type Definitions
 */
const TYPES = {

  arguments: {
    is: _.isArguments,
    to (value) {
      if (_.isArguments(value)) return value;
      if (_.isArray(value)) {
        return (function () { return arguments; }).apply(null, value);
      }
    }
  },

  array: {
    is (value, deep, extras) { // extras=allow(true or undefined), reject(false)
      if (!_.isArray(value)) return false;

      if (deep) {
        if (_.isArray(deep)) {
          return value.every((v, i) => {
            if (i >= deep.length) {
              if (extras === "reject" || extras === false) {
                throw "Array length expected to be " + deep.length + " and was " + value.length;
              } else {
                return true;
              }
            } else if (deep[i] && _.isFunction(deep[i].value)) {
              return !!deep[i].value(v, this.stack.concat([{k: i, v: value}]));
            } else if (_.isFunction(deep[i])) {
              return !!deep[i](v, i, value);
            }

            return false;
          });

        } else if (_.isFunction(deep.value)) {
          return value.every((v, i) => !!deep.value(v, this.stack.concat([{k: i, v: value}])));

        } else if (_.isFunction(deep)) {
          return value.every((v, i) => !!deep(v, i, value));
        }
      }

      return true;
    },
    to (value, deep, extras) { // extras=allow(default), omit(false), reject

      if (_.isArguments(value)) {
        value = Array.prototype.slice.call(value);
      } else {
        value = _.toArray(value);
      }

      if (deep && _.isArray(value)) {

        if (_.isArray(deep)) {
          let arr = [];
          value.forEach((v, i) => {
            if (i >= deep.length) {
              if (extras === "reject") {
                throw "Array length expected to be " + deep.length + " and was " + value.length;
              } else if (extras === "omit" || extras === false) {
                return;
              }
            } else if (deep[i] && _.isFunction(deep[i].value)) {
              v = deep[i].value(v, this.stack.concat([{k: i, v: value}]));
            } else if (_.isFunction(deep[i])) {
              v = deep[i](v, i, value);
            }
            arr.push(v);
          });

          return arr;

        } else if (_.isFunction(deep.value)) {
          return value.map((v, i) => deep.value(v, this.stack.concat([{k: i, v: value}])));

        } else if (_.isFunction(deep)) {
          return value.map((v, i) => deep(v, i, value));
        }
      }

      return value;
    },
    fn (value, deep, extras) {
      if (typeof value === "undefined") return;

      // If Array, try to convert
      if (_.isArray(value)) {
        return TYPES.array.to.call(this, value, deep, extras);

      } else {
        throw "Expected " + (typeof value) + " to be an array";
      }
    }
  },

  boolean: {
    is: _.isBoolean,
    to (value) {
      if (_.isBoolean(value)) return value;

      let lowerValue = (value + "").toLowerCase();
      if (lowerValue === "t" || lowerValue === "true") return true;
      if (lowerValue === "f" || lowerValue === "false") return false;
      return !!value;
    }
  },

  date: {
    is: _.isDate,
    to (value) {
      if (_.isDate(value)) return value;
      if (_.isString(value)) value = Date.parse(value);
      if (_.isNumber(value) && !_.isNaN(value)) return new Date(value);
    }
  },

  element: {
    is: _.isElement,
    to (value) {
      if (_.isElement(value)) return value;
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
      if (_.isError(value)) return value;
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
      if (_.isFunction(value)) return value;
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
      if (value instanceof Clazz) return value;
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
    is (value, deep, extras) { // extras=allow(true or undefined), reject(false)
      if (!_.isPlainObject(value)) return false;

      let keys = Object.keys(value);

      if (deep) {
        if (_.isPlainObject(deep)) {
          if ((extras === false || extras === "reject") && keys.length !== Object.keys(deep).length) return false;

          return keys.every((n, i) => {
            if (!(n in deep)) {
              return !(extras === false || extras === "reject");

            } else if (deep[n] && _.isFunction(deep[n].value)) {
              return !!deep[n].value(value[n], this.stack.concat([{k: n, v: value}]));

            } else if (_.isFunction(deep[n])) {
              return !!deep[n](value[n], n, value);
            }

            return false;
          });

        } else if (_.isFunction(deep.value)) {
          return keys.every(n => !!deep.value(value[n], this.stack.concat([{k: n, v: value}])));

        } else if (_.isFunction(deep)) {
          return keys.every(n => !!deep(value[n], n, value));
        }
      }

      return true;
    },
    to (value, deep, extras) { // extras=allow(default), omit(false), reject
      if (!_.isPlainObject(value)) value = _.toPlainObject(value);

      if (deep && _.isPlainObject(value)) {
        let keys = Object.keys(value);

        if (_.isPlainObject(deep)) {

          let omitted = {};
          Object.keys(deep).forEach(n => {
            let keyValue = deep[n];

            if (deep[n] && _.isFunction(deep[n].value)) {
              keyValue = deep[n].value(value[n], this.stack.concat([{k: n, v: value}]));
            } else if (_.isFunction(deep[n])) {
              keyValue = deep[n](value[n], n, value);
            }

            if (typeof keyValue !== "undefined") omitted[n] = value[n] = keyValue;
          });

          if (extras === "reject" && Object.keys(value).length > Object.keys(deep).length) {
            throw "Object contains unapproved keys";
          } else if (extras === "omit" || extras === false) {
            return omitted;
          }

        } else if (_.isFunction(deep.value)) {
          keys.forEach(n => {
            value[n] = deep.value(value[n], this.stack.concat([{k: n, v: value}]));
          });

        } else if (_.isFunction(deep)) {
          keys.forEach(n => value[n] = deep(value[n], n, value));
        }
      }

      return value;
    },
    fn (value, deep, extras) {
      if (typeof value === "undefined") return;

      // If Object, try to convert
      if (_.isPlainObject(value)) {
        return TYPES.object.to.call(this, value, deep, extras);

      } else {
        throw "Expected " + (typeof value) + " to be an object";
      }
    }
  },

  regExp: {
    is: _.isRegExp,
    to (value, flags) {
      if (_.isRegExp(value)) return value;
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



module.exports = TYPES;
