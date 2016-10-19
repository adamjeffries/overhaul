"use strict";

const _ = require("lodash");



/**
 * Helpers
 */
let setPrototypeOf = Object.setPrototypeOf || ({__proto__:[]} instanceof Array ? function (obj, proto) {
    obj.__proto__ = proto;
  } : function (obj, proto) {
    Object.keys(proto).forEach(name => obj[name] = proto[name]);
  });

let aOrAn = function (word) {
  if (!word || !word.length) return;
  return (["a", "e", "i", "o", "u"].indexOf(word.toLowerCase()[0])) > -1 ? "an" : "a";
};



/**
 * Constructor - works with and without "new"
 */
let TypeDef = function (def) {
  if (!(this instanceof TypeDef)) return new TypeDef(def);

  let ctx = function () {
    if (this._.chain.length) this._.chain[this._.chain.length].args = arguments;
    return this._.context;
  };

  // Setup TypeDef Context
  Object.assign(ctx, {_: { context: ctx, chain: [], value: undefined, stack: [] }});

  setPrototypeOf(ctx, TypeDef.prototype);
  return ctx;
};

TypeDef.prototype = {

  serialize () {
    return this.chain.map(c => c.name).join(".");
  },

  schema () {

  },

  value (value, key, parent) {
    this._.value = value;
    this._.stack = arguments.length === 3 ? [{key, value: parent}]: [];

    this._.chain.forEach(c => {
      let args = [this._.value].concat(c.args);
      this._.value = c.fn.apply(this, args);
    });

    return this._.value;
  }

};



/**
 * Register a new Definition
 */
TypeDef.register = function (name, fn) {

  if (_.isFunction(fn)) {

    // Instance Accessor
    Object.defineProperty(TypeDef.prototype, name, {
      get () {
        this._.chain.push({name, fn, args: []});
        return this._.context;
      }
    });

    // Static Accessor
    Object.defineProperty(TypeDef, name, { get: () => (new TypeDef())[name] });

    // Return the Class
    return TypeDef;

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

    if (is) TypeDef.register("is" + cName, is);

    // TO - type caster
    let to = _.isFunction(fn.to) ? function (value) {
      if (is && is.apply(this, arguments)) return value;
      try {
        return fn.to.apply(this, arguments);
      } catch (e) {}
    } : null;

    if (to) TypeDef.register("to" + cName, to);

    // FN - custom definition
    if (_.isFunction(fn.fn)) {
      TypeDef.register(name, fn.fn);

    // Generic FN - Use "IS" and throw
    } else if (fn.is || fn.to) {
      TypeDef.register(name, function (value) {
        if (is.apply(this, arguments)) return value;
        let msg = "Expected " + (typeof value) + " to be " + aOrAn(name) + " " + name;
        if (this._.stack.length) {
          let last = _.last(this._.stack);
          if (_.isArray(last.value)) {
            msg += " at index '" + last.key + "'";
          } else if (_.isPlainObject(this._.parent)) {
            msg += " for property '" + this._.key + "'";
          }
        }

        throw msg;
      });
    }

  }

};



/**
 * Basic Type Checker
 */
TypeDef.register("is", function (value, fn) {
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
TypeDef.register("to", function (value, fn) {
  try {
    return _.isFunction(fn) ? fn(value) : value;
  } catch (e) {}
});



module.exports = TypeDef;
