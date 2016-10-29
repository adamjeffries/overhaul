"use strict";

const typedef = require("./typedef");

// Register Definitions
typedef.register(require("./definitions/types"));
typedef.register(require("./definitions/traversals"));

// Lodash - prevent overriding existing methods
let lodash = require("./definitions/lodash");
Object.keys(lodash).forEach(name => {
  if (name in typedef) return;
  typedef.register(name, lodash[name]);
});

module.exports = typedef;
