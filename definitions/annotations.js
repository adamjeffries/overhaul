"use strict";

const _ = require("lodash");



module.exports = {

  example (value, example) {
    this.example = example;
    return value;
  },

  description (value, description) {
    this.description = description;
    return value;
  },

  deprecated (value, message) {
    this.deprecated = message || true;
    return value;
  },

  values (value, allowedValues) {
    if (_.isArray(allowedValues) && allowedValues.indexOf(value) === -1) {
      throw value + " is not an allowed value";
    }

    return value;
  },

  within (value, min, max) {
    if (_.isNumber(value) && value >= 0 && value <= max) return value;
    throw `Expected ${value} to be within ${min} and ${max}`;
  }

};
