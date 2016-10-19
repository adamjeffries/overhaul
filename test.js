"use strict";

const expect = require("expect.js"),
  t = require("./typedef");


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

});