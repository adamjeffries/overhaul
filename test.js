"use strict";

const expect = require("expect.js"),
  t = require("./index");


describe("Types", function () {

  describe("register", function () {
    it("Object Type Definitions", function () {

      t.register("foo", {
        is (value) {
          return value === "bar";
        },
        to (value) {
          if (value === "bar") return "bar";
          return "FOO";
        }
      });

      expect(t.isFoo.value("bar")).to.be(true);
      expect(t.isFoo.value("asdf")).to.be(false);
      expect(t.toFoo.value("bar")).to.be("bar");
      expect(t.toFoo.value("asdf")).to.be("FOO");
      expect(t.foo.value("bar")).to.be("bar");
      expect(function () {
        t.foo.value("asdf");
      }).to.throwError(/Expected string to be a foo/);
    });
  });

  describe("arguments", function () {

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

  describe("array", function () {

    it("Can Check", function () {
      expect(t.isArray.value(new Array())).to.be(true);
      expect(t.isArray.value([1,2,3])).to.be(true);
      expect(t.isArray.value("asdf")).to.be(false);
    });

    it("Can Check Deep", function () {
      expect(t.isArray(t.number).value([1, 2])).to.be(true);
      expect(t.isArray(t.number).value(["a", "b"])).to.be(false);
      expect(t.isArray([t.number, t.string, t.boolean]).value([1, "2", true])).to.be(true);
      expect(t.isArray([t.number, t.string, t.boolean]).value([1, 2, true])).to.be(false);
      expect(t.isArray(v => v % 2).value([1,3,5,7])).to.be(true);
      expect(t.isArray(v => v % 2).value([2,4,6,8])).to.be(false);
    });

    it("Can Cast", function () {
      var args = (function () { return arguments; }).call(null, 3, 4);

      expect(t.toArray.value([1, 2])).to.eql([1, 2]);
      expect(t.toArray.value(args)).to.eql([3, 4]);
      expect(t.toArray.value("12")).to.eql(["1", "2"]);
      expect(t.toArray.value({a: 1, b: 2})).to.eql([1, 2]);
    });

    it("Can Cast Deep", function () {
      var v1 = t.toArray(t.toNumber).value(["1", "two", 3]);

      expect(v1).to.have.length(3);
      expect(v1[0]).to.be(1);
      expect(v1[0]).to.be.a("number");
      expect(isNaN(v1[1])).to.be.ok();
      expect(v1[2]).to.be(3);

      var v2 = t.toArray([t.toNumber, t.toString, t.toArray(t.toNumber)]).value(["1", 2, ["3", "asdf"], "four"]);
      expect(v2).to.have.length(4);
      expect(v2[0]).to.be.a("number");
      expect(v2[1]).to.be.a("string");
      expect(v2[2]).to.have.length(2);
      expect(v2[2][0]).to.be.a("number");
      expect(isNaN(v2[2][1])).to.be.ok();
      expect(v2[3]).to.be("four");
    });

    it("Can Run", function () {
      var arr = [1, 2];

      expect(t.array.value(arr)).to.be(arr);
      expect(function () {
        t.array.value("asdf");
      }).to.throwError();
    });

  });

});