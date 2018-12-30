"use strict";

var should = require("chai").should();
var npwcore = require("../");

describe('#versionGuard', function() {
  it('global._npwcore should be defined', function() {
    should.equal(global._npwcore, npwcore.version);
  });

  it('throw an error if version is already defined', function() {
    (function() {
      npwcore.versionGuard('version');
    }).should.throw('More than one instance of npwcore');
  });
});
