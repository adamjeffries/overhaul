"use strict";

const expect = require("expect.js"),
  t = require("../index");


describe("TypeDef", function() {

  it("Should be an instance", function () {
    let d = new t();
    let d2 = t();
    let d3 = t.is;
    expect(d instanceof t).to.be.ok();
    expect(d2 instanceof t).to.be.ok();
    expect(d3 instanceof t).to.be.ok();
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

});