"use strict";

const expect = require("expect.js"),
  t = require("../index");


describe("Types", function() {

  describe("arguments", function() {

    it("Can Check", function () {
      var args = (function () { return arguments; }).call(null, 1, 2);
      var arr = [1, 2];

      expect(t.isArguments.value(args)).to.be(true);
      expect(t.isArguments.value(arr)).to.be(false);
      expect(t.isArguments.value("asdf")).to.be(false);
    });

    it("Can Cast", function () {
      var args = (function () { return arguments; }).call(null, 1, 2);
      var arr = [1, 2];

      expect(t.toArguments.value(args)).to.be(args);
      expect(t.toArguments.value(arr)).to.not.be(arr);
      expect(t.toArguments.value(arr)).to.have.length(2);
      expect(t.toArguments.value("asdf")).to.be(undefined);
    });

    it("Can Run", function () {
      var args = (function () { return arguments; }).call(null, 1, 2);
      var arr = [1, 2];

      expect(t.arguments.value(args)).to.be(args);
      expect(function () {
        t.arguments.value("asdf");
      }).to.throwError();
    });

  });

});