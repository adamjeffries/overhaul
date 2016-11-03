"use strict";

const _ = require("lodash");

module.exports = {

  noop () {
    return _.noop;
  },

  parse (value) {
    if (typeof value !== "string") return;

    // Trim
    value = value.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");

    // Ensure valid JSON (without quotes)
    if ( /^[\],:{}\s]*$/.test(value.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ":")
        .replace(/\w*\s*\:/g, ":")) ) {
      return (new Function("return " + value))();
    }
  },

  stringify (value) {
    return JSON.stringify(value);
  }

};



