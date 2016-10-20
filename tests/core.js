"use strict";

const expect = require("expect.js"),
  t = require("../index");


describe("TypeDef", function() {

  it("Should be an instance", function () {
    expect(new t() instanceof t).to.be.ok();
    expect(t() instanceof t).to.be.ok();
    expect(t.is().is() instanceof t).to.be.ok();
    expect(t.is.is instanceof t).to.be.ok();
    expect(t.is.is() instanceof t).to.be.ok();
    expect(t.is() instanceof t).to.be.ok();
    expect(t.is().is instanceof t).to.be.ok();
    expect(t.is().is() instanceof t).to.be.ok();
  });

  it("Can register function definitions", function () {

    t.register("hello", function (value) {
      return "hello " + (value || "unknown");
    });

    let h = t.hello.value();
    let h2 = t.hello.value("world");

    expect(h).to.be("hello unknown");
    expect(h2).to.be("hello world");
  });

  it("Can register object definitions", function () {

    t.register("foo", {
      is (value) {
        return value === "bar";
      },
      to (value) {
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

  it("Can get definitions", function () {

    t.register("abc", {
      is (value, a, b) {
        return value === "abc";
      },
      to (value) {
        return "ABC";
      }
    });

    let def = t.abc.isAbc(8,9).toAbc(10).definition();

    expect(def).to.have.length(3);
    expect(def[0][0]).to.be("abc");
    expect(def[0][1]).to.not.be.ok();
    expect(def[1][0]).to.be("isAbc");
    expect(def[1][1]).to.eql({a: 8, b: 9});
    expect(def[2][0]).to.be("toAbc");
    expect(def[2][1]).to.not.be.ok();
  });

  it("Can serialize", function () {

    t.register("xyz", {
      is (value, a, b) {
        return value === "xyz";
      },
      to (value) {
        return "XYZ";
      }
    });

    let s = t.xyz.isXyz(1,"hello.",true,[1,"a,b",false]).toXyz({a:1, b: "3"}).serialize();
    expect(s).to.be('xyz.isXyz(1,"hello.",true,[1,"a,b",false]).toXyz({"a":1,"b":"3"})');
    expect(function () {
      var a = {}; a.a = a; // Create a circular dependency
      t.xyz.isXyz(1,2,a).serialize();
    }).to.throwError(/Unable to serialize argument 3 of isXyz/);
  });

  it("Can deserialize", function () {
    t.register("jkl", function (value, a, b) { return value + a + b; });
    t.register("mno", function (value, arr, obj) { return value + arr[0] + obj.a; });

    let def1 = t.jkl(1,2).mno([2, "asdf"], {a: 3, b: "234"});
    let def2 = t(def1.serialize());

    expect(def1.value(3)).to.be(def2.value(3));
  });

});