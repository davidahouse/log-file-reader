"use strict";
/* eslint-env mocha */
const expect = require("chai").expect;
const reader = require("../index.js");

describe("Log File Reader", function() {
  beforeEach(() => {});

  it("should return empty if file itself is empty", function() {
    return reader
      .parseLog("./test/emptyfile", { first: 10 })
      .then(function(result) {
        expect(result.length).to.equal(0);
      });
  });

  it("should return empty if no options", function() {
    return reader.parseLog("./test/apache_logs", {}).then(function(result) {
      expect(result.length).to.equal(0);
    });
  });

  it("should return empty if file doesn't exist", function() {
    return reader
      .parseLog("./test/fileDoesNotExist", { first: 10 })
      .then(function(result) {
        expect(result.length).to.equal(0);
      });
  });

  it("should return first number of lines if first set in options", function() {
    return reader
      .parseLog("./test/apache_logs", { first: 10 })
      .then(function(result) {
        expect(result.length).to.equal(10);
      });
  });

  it("should return last number of lines if last set in options", function() {
    return reader
      .parseLog("./test/apache_logs", { last: 10 })
      .then(function(result) {
        expect(result.length).to.equal(10);
      });
  });

  it("should return correct items if includes specified", function() {
    return reader
      .parseLog("./test/apache_logs", { includes: "/blog/geekery/xdo.html" })
      .then(function(result) {
        expect(result.length).to.equal(9);
      });
  });

  it("should return line numbers", function() {
    return reader
      .parseLog("./test/apache_logs", { first: 10 })
      .then(function(result) {
        expect(result.length).to.equal(10);
        expect(result[0].lineNumber).to.equal(1);
        expect(result[9].lineNumber).to.equal(10);
      });
  });

  it("should return first number of KB if first set in options", function() {
    return reader
      .parseLog("./test/apache_logs", { firstKB: 64000 })
      .then(function(result) {
        expect(result.length).to.equal(281);
      });
  });

  it("should return last number of KB if last set in options", function() {
    return reader
      .parseLog("./test/apache_logs", { lastKB: 180 })
      .then(function(result) {
        expect(result.length).to.equal(2);
      });
  });
});
