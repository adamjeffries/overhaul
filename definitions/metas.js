"use strict";

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
    this.deprecated = message;
    return value;
  },

  default (value, defaultValue) {
    if (typeof value === "undefined") return defaultValue;
    return value;
  },

  required (value) {
    if (typeof value === "undefined") throw "Missing required value";
    return valu;
  }

};