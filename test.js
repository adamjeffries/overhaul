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

  describe("boolean", function () {

    it("Can Check", function () {
      expect(t.isBoolean.value(true)).to.be(true);
      expect(t.isBoolean.value(false)).to.be(true);
      expect(t.isBoolean.value("asdf")).to.be(false);
      expect(t.isBoolean.value(null)).to.be(false);
      expect(t.isBoolean.value(0)).to.be(false);
      expect(t.isBoolean.value(1)).to.be(false);
      expect(t.isBoolean.value("")).to.be(false);
    });

    it("Can Cast", function () {
      expect(t.toBoolean.value(true)).to.be(true);
      expect(t.toBoolean.value(false)).to.be(false);
      expect(t.toBoolean.value("t")).to.be(true);
      expect(t.toBoolean.value("true")).to.be(true);
      expect(t.toBoolean.value("asdf")).to.be(true);
      expect(t.toBoolean.value("f")).to.be(false);
      expect(t.toBoolean.value("false")).to.be(false);
      expect(t.toBoolean.value("")).to.be(false);
      expect(t.toBoolean.value(1)).to.be(true);
      expect(t.toBoolean.value(0)).to.be(false);
      expect(t.toBoolean.value(null)).to.be(false);
      expect(t.toBoolean.value(undefined)).to.be(false);
    });

    it("Can Run", function () {
      expect(t.boolean.value(true)).to.be(true);
      expect(function () {
        t.boolean.value("true");
      }).to.throwError();
    });

  });

  describe("date", function () {

    it("Can Check", function () {
      expect(t.isDate.value(new Date())).to.be(true);
      expect(t.isDate.value(123)).to.be(false);
      expect(t.isDate.value("asdf")).to.be(false);
    });

    it("Can Cast", function () {
      let d = new Date();
      expect(t.toDate.value(d)).to.be(d);
      expect(t.toDate.value(Date.now()) instanceof Date).to.be.ok();
      expect(t.toDate.value("December 17, 1995 03:24:00") instanceof Date).to.be.ok();
      expect(t.toDate.value("1995-12-17T03:24:00") instanceof Date).to.be.ok();
      expect(t.toDate.value("Sun Feb 01 1998 00:00:00 GMT+0000 (GMT)") instanceof Date).to.be.ok();
      expect(t.toDate.value("Mon, 25 Dec 1995 13:30:00 +0430") instanceof Date).to.be.ok();
      expect(t.toDate.value("March 7, 2014") instanceof Date).to.be.ok();
      expect(t.toDate.value("2014-03-07") instanceof Date).to.be.ok();
      expect(t.toDate.value("2011-10-10T14:48:00") instanceof Date).to.be.ok();
      expect(t.toDate.value("3/25/2014") instanceof Date).to.be.ok();
      expect(t.toDate.value("asdf")).to.not.be.ok();
      expect(t.toDate.value(true)).to.not.be.ok();
      expect(t.toDate.value([1,2,3])).to.not.be.ok();
    });

    it("Can Run", function () {
      let d = new Date();
      expect(t.date.value(d)).to.be(d);
      expect(function () {
        t.date.value("true");
      }).to.throwError();
    });

  });

  describe("object", function () {

    it("Can Check", function () {
      expect(t.isObject.value({})).to.be(true);
      expect(t.isObject.value(new Object())).to.be(true);
      expect(t.isObject.value(new Date())).to.be(false);
      expect(t.isObject.value(new RegExp())).to.be(false);
      expect(t.isObject.value([])).to.be(false);
      expect(t.isObject.value(function () {})).to.be(false);
    });

    it("Can Check Deep", function () {
      expect(t.isObject(t.number).value({a: 1, b: 2})).to.be(true);
      expect(t.isObject(t.number).value({a: 1, b: "2"})).to.be(false);
      expect(t.isObject({a: t.isString, b: t.isNumber, c: t.isBoolean}).value({a: "a", b: 1, c: false, d: 2})).to.be(true);
      expect(t.isObject({a: t.isString, b: t.isNumber, c: t.isBoolean}, false).value({a: "a", b: 1, c: false, d: 2})).to.be(false);
      expect(t.isObject({a: t.isString, b: t.isNumber, c: t.isBoolean}, false).value({a: "a", c: false, d: 2})).to.be(false);
    });

    it("Can Cast", function () {
      var Foo = function () { this.a = 1; };
      Foo.prototype.b = 2;
      var o = {a: 1};

      expect(t.toObject.value(o)).to.be(o);
      expect(t.toObject.value(new Foo())).to.eql({a: 1, b: 2});
      expect(t.toObject.value("abc")).to.eql({"0": "a", "1": "b", "2": "c"});
      expect(t.toObject.value([1,2,3])).to.eql({"0": 1, "1": 2, "2": 3});
      expect(t.toObject.value(true)).to.eql({});
    });

    it("Can Cast Deep", function () {
      var o1 = t.toObject(t.toNumber).value({a: 1, b: "2", c: "three"});
      expect(o1.a).to.eql(1);
      expect(o1.b).to.eql(2);
      expect(isNaN(o1.c)).to.eql(true);

      var o2 = t.toObject({a: t.toNumber, b: t.toString, c: t.toBoolean}).value({a: "1", b: 2, c: "three", d: 5});
      expect(o2.a).to.eql(1);
      expect(o2.b).to.eql("2");
      expect(o2.c).to.eql(true);
      expect(o2.d).to.eql(5);

      var o3 = t.toObject({a: t.toNumber, b: t.toString, c: t.toBoolean}, false).value({a: "1", b: 2, c: "three", d: 5});
      expect(o3.a).to.eql(1);
      expect(o3.b).to.eql("2");
      expect(o3.c).to.eql(true);
      expect(o3.d).to.not.be.ok();

      var o4 = t.toObject({a: t.toNumber, b: t.toString, c: t.toBoolean}, "reject").value({a: "1", b: 2, c: "three", d: 5});
      expect(o4).to.not.be.ok();
    });

    it("Can Run", function () {
      var o = {a: 1, b: 2};

      expect(t.object.value(o)).to.be(o);
      expect(function () {
        t.object.value("asdf");
      }).to.throwError(/Expected string to be an object/);
      expect(function () {
        t.object(t.string).value(o);
      }).to.throwError(/Expected number to be a string for property \'a\'/);

    });

  });

});



describe("Traversals", function () {

  it("Can Copy", function () {
    expect(t.copy("a", "c").value({a: 1, b: 2})).to.eql({a: 1, b: 2, c: 1});
    expect(t.key("a").copy("c").parent.value({a: 1, b: 2})).to.eql({a: 1, b: 2, c: 1});
  });

  it("Can Delete", function () {
    expect(t.delete("a").value({a: 1, b: 2})).to.eql({b: 2});
    expect(function () {
      t.delete("a").value("asdf");
    }).to.throwError(/Object required to delete key/);

    var o2 = t.key("a").delete.value({a: 1, b: 2});
    expect(t.key("a").delete.value({a: 1, b: 2})).to.eql({b: 2});
    expect(t.delete.value("asdf")).to.not.be.ok();
    expect(t.index(1).delete.value([1,2,3])).to.eql([1,3]);
  });

  it("Can get by index", function () {
    expect(t.index(1).value([1,2,3])).to.be(2);
    expect(t.index(1).index(1).value([1,[4,5,6],3])).to.be(5);
    expect(function () {
      t.index(1).value("asdf");
    }).to.throwError(/Index expects an array/);
  });

  it("Can get by key", function () {
    expect(t.key("b").value({a: 1, b: 2})).to.be(2);
    expect(t.key(1).value([1,2,3])).to.be(2);
    expect(t.key("b").key("f").value({a: 1, b: {e: 5, f: 6}, c: 3})).to.be(6);
    expect(t.key(1).key(1).value([1,[4,5,6],3])).to.be(5);
    expect(function () {
      t.key("a").value("asdf");
    }).to.throwError(/key expects an array or object/);
  });

  it("Can Move", function () {
    expect(t.move("a", "c").value({a: 1, b: 2})).to.eql({b: 2, c: 1});
    expect(t.move("a", "c").value({b: 2})).to.eql({b: 2, c: undefined});
    expect(t.key("a").move("c").parent.value({a: 1, b: 2})).to.eql({b: 2, c: 1});
    expect(t.key("a").move("c").parent.value({b: 2})).to.eql({b: 2, c: undefined});
  });

  it("Can get parent", function () {
    expect(t.key("b").key("f").parent.parent.key("a").value({a: 1, b: {e: 5, f: 6}, c: 3})).to.be(1);
    expect(t.parent.value("asdf")).to.not.be.ok();
  });

  it("Can get siblings", function () {
    expect(t.key("a").sibling("b").value({a: 1, b: 2})).to.be(2);
  });

});



describe("Modifiers", function () {

  it("Default", function () {
    expect(t.default("hello").value("anything")).to.be("anything");
    expect(t.default("hello").value()).to.be("hello");
  });

  it("Can Freeze", function () {
    var o = {a: 1, b: 2};
    var o2 = t.freeze.value(o);

    expect(function () {
      o2.a = 2;
    }).to.throwError(/Cannot assign to read only property 'a' of object '#<Object>'/);
  });

  it("Noop", function () {
    expect(t.noop.value("anything")).to.be.a("function");
    expect(t.noop().value("anything")()).to.not.be.ok();
  });

  it("Parse", function () {
    expect(t.parse.value('"something"')).to.be("something");
    expect(t.parse.value('{"a":1,"b":"two","c":true}')).to.eql({a: 1, b: "two", c: true});
    expect(t.parse.value('{garbage[')).to.be(undefined);
  });

  it("Required", function () {
    expect(t.required.value("anything")).to.be("anything");
    expect(function () {
      t.required.value();
    }).to.throwError(/Missing required value/);
  });

  it("Stringify", function () {
    expect(t.stringify.value({a: 1, b: "two", c: true})).to.be('{"a":1,"b":"two","c":true}');
    expect(t.stringify.value("something")).to.be('"something"');
    expect(t.stringify.value([1, "2", true])).to.be('[1,"2",true]');
  });

});



// Spot checking Lodash Methods
describe("Lodash", function () {

  it("Array Method Spot Check", function () {
    expect(t.fill(2).value(["a", "b", "c"])).to.eql([2, 2, 2]);
  });

  it("Collection Method Spot Check", function () {
    expect(t.filter({user: "fred"}).index(0).value([
      { user: "barney", age: 36, active: true },
      { user: "fred", age: 40, active: false }
    ])).to.eql({user: "fred", age: 40, active: false});
  });

  it("Date Method Spot Check", function () {
    expect(t.now.value("asdf")).to.be.a("number");
  });

  it("Function Method Spot Check", function () {
    expect(t.flip.value(function () { return Array.prototype.slice.call(arguments); })(1, 2, 3)).to.eql([3, 2, 1]);
  });

  it("Lang Method Spot Check", function () {
    expect(t.lt(3).value(1)).to.be.ok();
  });

  it("Math Method Spot Check", function () {
    expect(t.max.value([2, 6, 3, 1])).to.be(6);
  });

  it("Number Method Spot Check", function () {
    expect(t.clamp(-5, 5).value(-10)).to.be(-5);
  });

  it("Object Method Spot Check", function () {
    expect(t.pick(["a", "c"]).value({a: 1, b: 2, c: 3, d: 4})).to.eql({a: 1, c: 3});
  });

  it("String Method Spot Check", function () {
    expect(t.camelCase.value("__FOO_BAR__")).to.be("fooBar");
  });

  it("Util Method Spot Check", function () {
    expect(t.range.value(4)).to.eql([0,1,2,3]);
  });

});



describe("Annotations", function () {

  it("Can Deprecate", function () {
    expect(t.deprecated.definition()[0].values.message).to.not.be.ok();
    expect(t.deprecated("Please X Instead").definition()[0].values.message).to.be("Please X Instead");
  });

  it("Can Describe", function () {
    expect(t.description("Hello World").definition()[0].values.description).to.be("Hello World");
  });

  it("Can add Examples", function () {
    expect(t.example("Hello World").definition()[0].values.example).to.be("Hello World");
  });

});
