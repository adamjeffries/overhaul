"use strict";

const oh = require("./src/overhaul");

// Register Definitions
oh.register(require("./src/types"));
oh.register(require("./src/traversals"));
oh.register(require("./src/annotations"));
oh.register(require("./src/modifiers"));

// Lodash - prevent overriding existing definitions
let lodash = require("./src/lodash");
Object.keys(lodash).forEach(name => {
  if (name in oh) return;
  oh.register(name, lodash[name]);
});

module.exports = oh;
