"use strict";

var typedef = require("./typedef");

// Register Default Definitions
typedef.register(require("./definitions/types"));

module.exports = typedef;
