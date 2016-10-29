"use strict";

var typedef = require("./typedef");

// Register Definitions
typedef.register(require("./definitions/types"));
typedef.register(require("./definitions/traversals"));

module.exports = typedef;
