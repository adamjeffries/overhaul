"use strict";

const chainable = require("chainable.js"),
  settings = require("./settings"),
  _ = require("lodash");



/**
 * Helpers
 */

let aOrAn = function (word) {
  if (!word || !word.length) return;
  return (["a", "e", "i", "o", "u"].indexOf(word.toLowerCase()[0])) > -1 ? "an" : "a";
};

let getArgumentNames = function (fn) {
  var args = fn.toString().match(/.*?\(([^)]*)\)/)[1];
  return args.split(",").map(o => o.replace(/\/\*.*\*\//, "").trim()).filter(o => o);
};



/**
 * Overhaul (Chainable Instance)
 */
let Overhaul = chainable();
Overhaul.settings = settings;


/**
 * Value - support stack (k, v)
 */
let originalValue = Overhaul.prototype.value;
Overhaul.prototype.value = function (value, stack) {
  this._context.stack = stack || [];
  return originalValue.call(this, value);
};



/**
 * Upgrade the default register to support (name, {is, to, fn})
 */
let register = Overhaul.register;
Overhaul.register = function (name, fn, argNames) {
  if (_.isPlainObject(name)) {
    Object.keys(name).forEach(n => Overhaul.register(n, name[n]));

  } else if (_.isPlainObject(fn) && (fn.is || fn.to || fn.fn)) {

    let cName = name[0].toUpperCase() + name.slice(1);

    // IS - type checker
    let is = _.isFunction(fn.is) ? function () {
      try {
        return !!fn.is.apply(this, arguments);
      } catch (e) {
        return false;
      }
    } : null;

    let isArgNames = is ? getArgumentNames(fn.is).slice(1) : null;

    if (is) {
      register("is" + cName, is, isArgNames);
      register("isNot" + cName, function () {
        return !is.apply(this, arguments);
      }, isArgNames);
    }

    // TO - type caster
    if (_.isFunction(fn.to)) {
      register("to" + cName, function (value) {
        try {
          return fn.to.apply(this, arguments);
        } catch (e) {}
      }, getArgumentNames(fn.to).slice(1));
    }

    // FN - custom definition
    if (_.isFunction(fn.fn)) {
      Overhaul.register(name, fn.fn);

    // Generic FN - Use "IS" and throw
    } else if (is) {
      Overhaul.register(name, function (value) {
        if (typeof value === "undefined") return;

        // Check "is" without any safety nets
        if (fn.is.apply(this, arguments)) {
          return value;
        } else {
          throw "Expected " + (typeof value) + " to be " + aOrAn(name) + " " + name;
        }
      }, isArgNames);
    }

  } else {
    register(name, function () {
      try {
        return fn.apply(this, arguments);

      } catch (err) {
        //If a stack has been started - make a better error message
        if (this.stack && this.stack.length) {
          let last = _.last(this.stack);
          if (_.isArray(last.v)) {
            err += " at index '" + last.k + "'";
          } else if (_.isPlainObject(last.v)) {
            err += " for property '" + last.k + "'";
          }
        }

        throw err;
      }
    }, argNames || getArgumentNames(fn).slice(1));
  }

  return Overhaul;
};



/**
 * Basic Tester
 */
Overhaul.register("test", function (value, fn) {
  if (_.isFunction(fn)) {
    let rtn = fn(value);
    if (typeof rtn === "string") {
      throw rtn;
    } else if (rtn === false) {
      throw "Test failed for value '" + value + "'";
    }
  }
  
  return value;
});



/**
 * Basic Value Tester
 */
Overhaul.register("is", function (value, fn) {
  try {
    if (_.isFunction(fn)) return !!fn(value);
    return (value instanceof fn) || (value === fn);
  } catch (e) {
    return false;
  }
});



/**
 * Basic Type Caster
 */
Overhaul.register("to", function (value, fn) {
  try {
    return _.isFunction(fn) ? fn(value) : value;
  } catch (e) {}
});



module.exports = Overhaul;
