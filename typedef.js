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

let getArgumentNames = function (fn) {
  var args = fn.toString().match(/.*?\(([^)]*)\)/)[1];
  return args.split(",").map(o => o.replace(/\/\*.*\*\//, "").trim()).filter(o => o);
};



/**
 * Constructor - works with and without "new"
 */
let TypeDef = function (def) {
  if (!(this instanceof TypeDef)) return new TypeDef(def);

  let ctx = function () {
    if (ctx._.chain.length) {
      ctx._.chain[ctx._.chain.length - 1].args = Array.prototype.slice.call(arguments);
    }
    return ctx;
  };

  // Setup TypeDef Context
  Object.assign(ctx, {_: {context: ctx, chain: [], value: undefined, stack: [] }});
  setPrototypeOf(ctx, TypeDef.prototype);

  // Initialize from a serialized typedef
  if (def && _.isString(def)) {
    let oldChain = []; // {name, args}

    // Separate method names and arguments
    try {
      let deserializeRegex = /(^(\w*)|\.(\w*))(?:\((.*?)\))*/g;
      let match;
      while (match = deserializeRegex.exec(def)) {
        let c = {name: match[2] || match[3]};
        if (match[4]) c.args = "[" + match[4] + "]";
        oldChain.push(c);
      }
    } catch (e) {
      throw "Unable to deserialize: " + s;
    }

    // Parse Arguments and call methods
    oldChain.forEach(c => {
      if (!c.name in ctx) throw "Typedef does not have method: " + c.name;
      ctx[c.name]; // The getter will add the function to the chain
      if (c.args) {
        try {
          c.args = JSON.parse(c.args);
        } catch (e) {}
        if (!_.isArray(c.args)) throw "Unable to deserialize arguments: '" + c.args + "'";
        ctx._.chain[ctx._.chain.length - 1].args = c.args;
      }
    });
  }

  return ctx;
};

TypeDef.prototype = {

  serialize () {
    return this._.chain.map(c => {
      let str = c.name;
      if (c.args.length) {
        str += "(" + c.args.map((v, i) => {
          try {
            return JSON.stringify(v);
          } catch (e) {
            throw "Unable to serialize argument " + (i + 1) + " of " + c.name;
          }
        }).join(",") + ")";
      }
      return str;
    }).join(".");
  },

  definition () {
    return this._.chain.map(c => {
      let argNames = TypeDef._.argumentNames[c.name];
      if (c.args && c.args.length && argNames.length) {
        let d = {};
        c.args.forEach((value, index) => {
          if (index < argNames.length) d[argNames[index]] = value;
        });
        return [c.name, d];
      } else { // No Arguments
        return [c.name];
      }
    })
  },

  value (value, key, parent) {
    this._.value = value;
    this._.stack = arguments.length === 3 ? [{key, value: parent}]: [];

    this._.chain.forEach(c => {
      this._.value = c.fn.apply(this, [this._.value].concat(c.args));
    });

    return this._.value;
  }

};

TypeDef._ = {
  argumentNames: {}
};



/**
 * Register a new Definition
 */
let register = function (name, fn, argNames) {

  // Get Argument Names if not already passed
  TypeDef._.argumentNames[name] = argNames || getArgumentNames(fn).slice(1);

  // Instance Accessor
  Object.defineProperty(TypeDef.prototype, name, {
    get () {
      this._.chain.push({name, fn, args: []});
      return this;
    }
  });

  // Static Accessor (weird impl, I know)
  Object.defineProperty(TypeDef, name, { get: () => TypeDef()[name]});

};

TypeDef.register = function (name, fn) {

  if (arguments.length === 1 && _.isPlainObject(name)){
    Object.keys(name).forEach(n => TypeDef.register(n, name[n]));

  } else if (_.isFunction(fn)) {
    register(name, fn);

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
        if (is && is.apply(this, arguments)) return value;
        try {
          return fn.to.apply(this, arguments);
        } catch (e) {}
      }, getArgumentNames(fn.to).slice(1));
    }

    // FN - custom definition
    if (_.isFunction(fn.fn)) {
      register(name, fn.fn);

    // Generic FN - Use "IS" and throw
    } else if (is) {
      register(name, function (value) {
        if (typeof value === "undefined") return;
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
      }, isArgNames);
    }

  }

  return TypeDef;
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
