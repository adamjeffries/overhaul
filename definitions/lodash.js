"use strict";

const _ = require("lodash");

module.exports = _.omit(_, ["_", "VERSION", "chain", "tap", "thru", "templateSettings"]);