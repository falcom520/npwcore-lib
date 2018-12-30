'use strict';
/* jshint unused: false */

var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');

var npwcore = require('../../..');
var Transaction = npwcore.Transaction;
var PrivateKey = npwcore.PrivateKey;
var Address = npwcore.Address;
var Script = npwcore.Script;
var Networks = npwcore.Networks;
var Signature = npwcore.crypto.Signature;

describe('PublicKeyHashInput', function() {

  var privateKey = new PrivateKey('YMx7NHhRHZr7khqwarzFhgz4tVuuTereTeYRneQxG7eqRAzuHWGq');
  var publicKey = privateKey.publicKey;
  var address = new Address(publicKey, Networks.livenet);

  var output = {
    address: '6GhRctxkEzLP8tz3akYech9PMs5J3DZEL9',
    txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
    outputIndex: 0,
    script: new Script(address),
    satoshis: 1000000
  };
  it('can count missing signatures', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    input.isFullySigned().should.equal(false);
    transaction.sign(privateKey);
    input.isFullySigned().should.equal(true);
  });
  it('it\'s size can be estimated', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    input._estimateSize().should.equal(107);
  });
  it('it\'s signature can be removed', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    transaction.sign(privateKey);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });
  it('returns an empty array if private key mismatches', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var signatures = input.getSignatures(transaction, new PrivateKey(), 0);
    signatures.length.should.equal(0);
  });
});
