"use strict";

const expect = require("expect.js"),
  oh = require("./index");


describe("Types", function () {

  describe("register", function () {
    it("Object Type Definitions", function () {

      oh.register("foo", {
        is (value) {
          return value === "bar";
        },
        to (value) {
          if (value === "bar") return "bar";
          return "FOO";
        }
      });

      expect(oh.isFoo.value("bar")).to.be(true);
      expect(oh.isFoo.value("asdf")).to.be(false);
      expect(oh.toFoo.value("bar")).to.be("bar");
      expect(oh.toFoo.value("asdf")).to.be("FOO");
      expect(oh.foo.value("bar")).to.be("bar");
      expect(function () {
        oh.foo.value("asdf");
      }).to.throwError(/Expected string to be a foo/);
    });
  });

  describe("arguments", function () {

    it("Can Check", function () {
      var args = (function () { return arguments; }).call(null, 1, 2);
      var arr = [1, 2];

      expect(oh.isArguments.value(args)).to.be(true);
      expect(oh.isArguments.value(arr)).to.be(false);
      expect(oh.isArguments.value("asdf")).to.be(false);
    });

    it("Can Cast", function () {
      var args = (function () { return arguments; }).call(null, 1, 2);
      var arr = [1, 2];

      expect(oh.toArguments.value(args)).to.be(args);
      expect(oh.toArguments.value(arr)).to.not.be(arr);
      expect(oh.toArguments.value(arr)).to.have.length(2);
      expect(oh.toArguments.value("asdf")).to.be(undefined);
    });

    it("Can Run", function () {
      var args = (function () { return arguments; }).call(null, 1, 2);
      var arr = [1, 2];

      expect(oh.arguments.value(args)).to.be(args);
      expect(function () {
        oh.arguments.value("asdf");
      }).to.throwError();
    });

  });

  describe("array", function () {

    it("Can Check", function () {
      expect(oh.isArray.value(new Array())).to.be(true);
      expect(oh.isArray.value([1,2,3])).to.be(true);
      expect(oh.isArray.value("asdf")).to.be(false);
    });

    it("Can Check Deep", function () {
      expect(oh.isArray(oh.number).value([1, 2])).to.be(true);
      expect(oh.isArray(oh.number).value(["a", "b"])).to.be(false);
      expect(oh.isArray([oh.number, oh.string, oh.boolean]).value([1, "2", true])).to.be(true);
      expect(oh.isArray([oh.number, oh.string, oh.boolean]).value([1, 2, true])).to.be(false);
      expect(oh.isArray(v => v % 2).value([1,3,5,7])).to.be(true);
      expect(oh.isArray(v => v % 2).value([2,4,6,8])).to.be(false);
    });

    it("Can Cast", function () {
      var args = (function () { return arguments; }).call(null, 3, 4);

      expect(oh.toArray.value([1, 2])).to.eql([1, 2]);
      expect(oh.toArray.value(args)).to.eql([3, 4]);
      expect(oh.toArray.value("12")).to.eql(["1", "2"]);
      expect(oh.toArray.value({a: 1, b: 2})).to.eql([1, 2]);
    });

    it("Can Cast Deep", function () {
      var v1 = oh.toArray(oh.toNumber).value(["1", "two", 3]);

      expect(v1).to.have.length(3);
      expect(v1[0]).to.be(1);
      expect(v1[0]).to.be.a("number");
      expect(isNaN(v1[1])).to.be.ok();
      expect(v1[2]).to.be(3);

      var v2 = oh.toArray([oh.toNumber, oh.toString, oh.toArray(oh.toNumber)]).value(["1", 2, ["3", "asdf"], "four"]);
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

      expect(oh.array.value(arr)).to.eql(arr);
      expect(function () {
        oh.array.value("asdf");
      }).to.throwError();
    });

  });

  describe("boolean", function () {

    it("Can Check", function () {
      expect(oh.isBoolean.value(true)).to.be(true);
      expect(oh.isBoolean.value(false)).to.be(true);
      expect(oh.isBoolean.value("asdf")).to.be(false);
      expect(oh.isBoolean.value(null)).to.be(false);
      expect(oh.isBoolean.value(0)).to.be(false);
      expect(oh.isBoolean.value(1)).to.be(false);
      expect(oh.isBoolean.value("")).to.be(false);
    });

    it("Can Cast", function () {
      expect(oh.toBoolean.value(true)).to.be(true);
      expect(oh.toBoolean.value(false)).to.be(false);
      expect(oh.toBoolean.value("t")).to.be(true);
      expect(oh.toBoolean.value("true")).to.be(true);
      expect(oh.toBoolean.value("asdf")).to.be(true);
      expect(oh.toBoolean.value("f")).to.be(false);
      expect(oh.toBoolean.value("false")).to.be(false);
      expect(oh.toBoolean.value("")).to.be(false);
      expect(oh.toBoolean.value(1)).to.be(true);
      expect(oh.toBoolean.value(0)).to.be(false);
      expect(oh.toBoolean.value(null)).to.be(false);
      expect(oh.toBoolean.value(undefined)).to.be(false);
    });

    it("Can Run", function () {
      expect(oh.boolean.value(true)).to.be(true);
      expect(function () {
        oh.boolean.value("true");
      }).to.throwError();
    });

  });

  describe("date", function () {

    it("Can Check", function () {
      expect(oh.isDate.value(new Date())).to.be(true);
      expect(oh.isDate.value(123)).to.be(false);
      expect(oh.isDate.value("asdf")).to.be(false);
    });

    it("Can Cast", function () {
      let d = new Date();
      expect(oh.toDate.value(d)).to.be(d);
      expect(oh.toDate.value(Date.now()) instanceof Date).to.be.ok();
      expect(oh.toDate.value("December 17, 1995 03:24:00") instanceof Date).to.be.ok();
      expect(oh.toDate.value("1995-12-17T03:24:00") instanceof Date).to.be.ok();
      expect(oh.toDate.value("Sun Feb 01 1998 00:00:00 GMT+0000 (GMT)") instanceof Date).to.be.ok();
      expect(oh.toDate.value("Mon, 25 Dec 1995 13:30:00 +0430") instanceof Date).to.be.ok();
      expect(oh.toDate.value("March 7, 2014") instanceof Date).to.be.ok();
      expect(oh.toDate.value("2014-03-07") instanceof Date).to.be.ok();
      expect(oh.toDate.value("2011-10-10T14:48:00") instanceof Date).to.be.ok();
      expect(oh.toDate.value("3/25/2014") instanceof Date).to.be.ok();
      expect(oh.toDate.value("asdf")).to.not.be.ok();
      expect(oh.toDate.value(true)).to.not.be.ok();
      expect(oh.toDate.value([1,2,3])).to.not.be.ok();
    });

    it("Can Run", function () {
      let d = new Date();
      expect(oh.date.value(d)).to.be(d);
      expect(function () {
        oh.date.value("true");
      }).to.throwError();
    });

  });

  describe("object", function () {

    it("Can Check", function () {
      expect(oh.isObject.value({})).to.be(true);
      expect(oh.isObject.value(new Object())).to.be(true);
      expect(oh.isObject.value(new Date())).to.be(false);
      expect(oh.isObject.value(new RegExp())).to.be(false);
      expect(oh.isObject.value([])).to.be(false);
      expect(oh.isObject.value(function () {})).to.be(false);
    });

    it("Can Check Deep", function () {
      expect(oh.isObject(oh.number).value({a: 1, b: 2})).to.be(true);
      expect(oh.isObject(oh.number).value({a: 1, b: "2"})).to.be(false);
      expect(oh.isObject({a: oh.isString, b: oh.isNumber, c: oh.isBoolean}).value({a: "a", b: 1, c: false, d: 2})).to.be(true);
      expect(oh.isObject({a: oh.isString, b: oh.isNumber, c: oh.isBoolean}, false).value({a: "a", b: 1, c: false, d: 2})).to.be(false);
      expect(oh.isObject({a: oh.isString, b: oh.isNumber, c: oh.isBoolean}, false).value({a: "a", c: false, d: 2})).to.be(false);
    });

    it("Can Cast", function () {
      var Foo = function () { this.a = 1; };
      Foo.prototype.b = 2;
      var o = {a: 1};

      expect(oh.toObject.value(o)).to.be(o);
      expect(oh.toObject.value(new Foo())).to.eql({a: 1, b: 2});
      expect(oh.toObject.value("abc")).to.eql({"0": "a", "1": "b", "2": "c"});
      expect(oh.toObject.value([1,2,3])).to.eql({"0": 1, "1": 2, "2": 3});
      expect(oh.toObject.value(true)).to.eql({});
    });

    it("Can Cast Deep", function () {
      var o1 = oh.toObject(oh.toNumber).value({a: 1, b: "2", c: "three"});
      expect(o1.a).to.eql(1);
      expect(o1.b).to.eql(2);
      expect(isNaN(o1.c)).to.eql(true);

      var o2 = oh.toObject({a: oh.toNumber, b: oh.toString, c: oh.toBoolean}).value({a: "1", b: 2, c: "three", d: 5});
      expect(o2.a).to.eql(1);
      expect(o2.b).to.eql("2");
      expect(o2.c).to.eql(true);
      expect(o2.d).to.eql(5);

      var o3 = oh.toObject({a: oh.toNumber, b: oh.toString, c: oh.toBoolean}, false).value({a: "1", b: 2, c: "three", d: 5});
      expect(o3.a).to.eql(1);
      expect(o3.b).to.eql("2");
      expect(o3.c).to.eql(true);
      expect(o3.d).to.not.be.ok();

      var o4 = oh.toObject({a: oh.toNumber, b: oh.toString, c: oh.toBoolean}, "reject").value({a: "1", b: 2, c: "three", d: 5});
      expect(o4).to.not.be.ok();
    });

    it("Can Run", function () {
      var o = {a: 1, b: 2};

      expect(oh.object.value(o)).to.be(o);
      expect(function () {
        oh.object.value("asdf");
      }).to.throwError(/Expected string to be an object/);
      expect(function () {
        oh.object(oh.string).value(o);
      }).to.throwError(/Expected number to be a string for property \'a\'/);

    });

  });

});



describe("Traversals", function () {

  it("Can Copy", function () {
    expect(oh.copy("a", "c").value({a: 1, b: 2})).to.eql({a: 1, b: 2, c: 1});
    expect(oh.key("a").copy("c").parent.value({a: 1, b: 2})).to.eql({a: 1, b: 2, c: 1});
  });

  it("Can Delete", function () {
    expect(oh.delete("a").value({a: 1, b: 2})).to.eql({b: 2});
    expect(function () {
      oh.delete("a").value("asdf");
    }).to.throwError(/Object required to delete key/);

    expect(oh.key("a").delete.parent.value({a: 1, b: 2})).to.eql({b: 2});
    expect(oh.delete.value("asdf")).to.not.be.ok();
    expect(oh.index(1).delete.parent.value([1,2,3])).to.eql([1,3]);
  });

  it("Can get by index", function () {
    expect(oh.index(1).value([1,2,3])).to.be(2);
    expect(oh.index(1).index(1).value([1,[4,5,6],3])).to.be(5);
    expect(function () {
      oh.index(1).value("asdf");
    }).to.throwError(/Index expects an array/);
  });

  it("Can get by key", function () {
    expect(oh.key("b").value({a: 1, b: 2})).to.be(2);
    expect(oh.key(1).value([1,2,3])).to.be(2);
    expect(oh.key("b").key("f").value({a: 1, b: {e: 5, f: 6}, c: 3})).to.be(6);
    expect(oh.key(1).key(1).value([1,[4,5,6],3])).to.be(5);
    expect(function () {
      oh.key("a").value("asdf");
    }).to.throwError(/key expects an array or object/);
  });

  it("Can Move", function () {
    expect(oh.move("a", "c").value({a: 1, b: 2})).to.eql({b: 2, c: 1});
    expect(oh.move("a", "c").value({b: 2})).to.eql({b: 2, c: undefined});
    expect(oh.key("a").move("c").parent.value({a: 1, b: 2})).to.eql({b: 2, c: 1});
    expect(oh.key("a").move("c").parent.value({b: 2})).to.eql({b: 2, c: undefined});
  });

  it("Can get parent", function () {
    expect(oh.key("b").key("f").parent.parent.key("a").value({a: 1, b: {e: 5, f: 6}, c: 3})).to.be(1);
    expect(oh.parent.value("asdf")).to.not.be.ok();
  });

  it("Can get siblings", function () {
    expect(oh.key("a").sibling("b").value({a: 1, b: 2})).to.be(2);
  });

});



describe("Modifiers", function () {

  it("Default", function () {
    expect(oh.default("hello").value("anything")).to.be("anything");
    expect(oh.default("hello").value()).to.be("hello");
    expect(oh.default(function () { return "hello"; }).value()).to.be("hello");
  });

  it("Can Freeze", function () {
    var o = {a: 1, b: 2};
    var o2 = oh.freeze.value(o);

    expect(function () {
      o2.a = 2;
    }).to.throwError(/Cannot assign to read only property 'a' of object '#<Object>'/);
  });

  it("Noop", function () {
    expect(oh.noop.value("anything")).to.be.a("function");
    expect(oh.noop().value("anything")()).to.not.be.ok();
  });

  it("Parse", function () {
    expect(oh.parse.value('"something"')).to.be("something");
    expect(oh.parse.value('{"a":1,"b":"two","c":true}')).to.eql({a: 1, b: "two", c: true});
    expect(oh.parse.value('{garbage[')).to.be(undefined);
  });

  it("Required", function () {
    expect(oh.required.value("anything")).to.be("anything");
    expect(function () {
      oh.required.value();
    }).to.throwError(/Missing required value/);
  });

  it("Stringify", function () {
    expect(oh.stringify.value({a: 1, b: "two", c: true})).to.be('{"a":1,"b":"two","c":true}');
    expect(oh.stringify.value("something")).to.be('"something"');
    expect(oh.stringify.value([1, "2", true])).to.be('[1,"2",true]');
  });

});



// Spot checking Lodash Methods
describe("Lodash", function () {

  it("Array Method Spot Check", function () {
    expect(oh.fill(2).value(["a", "b", "c"])).to.eql([2, 2, 2]);
  });

  it("Collection Method Spot Check", function () {
    expect(oh.filter({user: "fred"}).index(0).value([
      { user: "barney", age: 36, active: true },
      { user: "fred", age: 40, active: false }
    ])).to.eql({user: "fred", age: 40, active: false});
  });

  it("Date Method Spot Check", function () {
    expect(oh.now.value("asdf")).to.be.a("number");
  });

  it("Function Method Spot Check", function () {
    expect(oh.flip.value(function () { return Array.prototype.slice.call(arguments); })(1, 2, 3)).to.eql([3, 2, 1]);
  });

  it("Lang Method Spot Check", function () {
    expect(oh.lt(3).value(1)).to.be.ok();
  });

  it("Math Method Spot Check", function () {
    expect(oh.max.value([2, 6, 3, 1])).to.be(6);
  });

  it("Number Method Spot Check", function () {
    expect(oh.clamp(-5, 5).value(-10)).to.be(-5);
  });

  it("Object Method Spot Check", function () {
    expect(oh.pick(["a", "c"]).value({a: 1, b: 2, c: 3, d: 4})).to.eql({a: 1, c: 3});
  });

  it("String Method Spot Check", function () {
    expect(oh.camelCase.value("__FOO_BAR__")).to.be("fooBar");
  });

  it("Util Method Spot Check", function () {
    expect(oh.range.value(4)).to.eql([0,1,2,3]);
  });

});



describe("Annotations", function () {

  it("Can Deprecate", function () {
    expect(oh.deprecated.definition()[0].values.message).to.not.be.ok();
    expect(oh.deprecated("Please X Instead").definition()[0].values.message).to.be("Please X Instead");
  });

  it("Can Describe", function () {
    expect(oh.description("Hello World").definition()[0].values.description).to.be("Hello World");
  });

  it("Can add Examples", function () {
    expect(oh.example("Hello World").definition()[0].values.example).to.be("Hello World");
  });

  it("Can have values", function () {
    expect(oh.values([4,5,6]).value(5)).to.be(5);
    expect(function () {
      oh.values([4,5,6]).value(7);
    }).to.throwError(/7 is not an allowed value/);
  });

  it("Can be within", function () {
    expect(oh.within(0, 10).value(5)).to.be(5);
    expect(function () {
      oh.within(0, 10).value(15);
    }).to.throwError(/Expected 15 to be within 0 and 10/);
  });

});
