"use strict";

const _ = require("lodash");



module.exports = {

  copy (value, keyA, keyB) {
    if (arguments.length === 3) { // Copy object from a to b
      if (_.isObject(value)) {
        value[keyB] = _.cloneDeep(value[keyA]);
        return value;

      } else {
        throw "Object expected to be able to copy"
      }

    } else if (arguments.length === 2) { // Assume parent exists and value is the current key
      if (this.stack.length && _.isObject(this.stack[this.stack.length - 1].v)) {
        this.stack[this.stack.length - 1].v[keyA] = _.cloneDeep(value);
        return value;

      } else {
        throw "Parent expected to be an object";
      }
    } else {
      throw "Key is required";
    }
  },

  delete (value, key) {
    if (key) {
      if (_.isObject(value)) {
        delete value[key];
        return value;
      } else {
        throw "Object required to delete key";
      }
    }
    if (!this.stack.length) return;
    let s = this.stack[this.stack.length - 1];
    if (_.isArray(s.v)) {
      s.v.splice(s.k, 1);

    } else if (_.isObject(s.v)) {
      delete s.v[s.k];

    } else {
      throw "Cannot delete";
    }
  },

  index (value, index) {
    if (arguments.length != 2) throw "index is required";
    if (_.isArray(value)) {
      this.stack.push({k: index, v: value});
      return value[index];
    } else {
      throw "Index expects an array";
    }
  },

  key (value, key) {
    if (arguments.length != 2) throw "key is required";
    if (_.isObject(value) || _.isArray(value)) {
      this.stack.push({k: key, v: value});
      return value[key];
    } else {
      throw "key expects an array or object";
    }
  },

  move (value, keyA, keyB) {
    if (arguments.length === 3) { // Move object from a to b
      if (_.isObject(value)) {
        value[keyB] = value[keyA];
        delete value[keyA];
        return value;

      } else {
        throw "Object expected to be able to move"
      }

    } else if (arguments.length === 2) { // Assume parent exists and value is the current key
      let last = this.stack[this.stack.length - 1];
      if (last && _.isObject(last.v)) {
        last.v[keyA] = value;
        delete last.v[last.k];
        last.k = keyA;

      } else {
        throw "Parent expected to be an object";
      }
    } else {
      throw "Key is required";
    }
  },

  parent () {
    if (!this.stack.length) return;
    return this.stack.pop().v;
  },

  sibling (value, key) {
    if (arguments.length != 2) throw "key is required";
    if (!this.stack.length) return;
    let s = this.stack.pop();
    s.k = key;
    this.stack.push(s);
    return s.v[s.k];
  }

};
