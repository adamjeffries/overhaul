"use strict";

const oh = require("./overhaul");

// Register Definitions
oh.register(require("./definitions/types"));
oh.register(require("./definitions/traversals"));
oh.register(require("./definitions/annotations"));
oh.register(require("./definitions/modifiers"));

// Lodash - prevent overriding existing methods
let lodash = require("./definitions/lodash");
Object.keys(lodash).forEach(name => {
  if (name in oh) return;
  oh.register(name, lodash[name]);
});

module.exports = oh;
