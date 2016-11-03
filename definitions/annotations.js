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
    this.deprecated = message || true;
    return value;
  }

};
