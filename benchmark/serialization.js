'use strict';

var benchmark = require('benchmark');
var npwcore = require('..');
var async = require('async');
var blockData = require('./block-23600.json');

var maxTime = 20;

console.log('Benchmarking Block/Transaction Serialization');
console.log('---------------------------------------');

async.series([
  function(next) {

    var buffers = [];
    var hashBuffers = [];
    console.log('Generating Random Test Data...');
    for (var i = 0; i < 100; i++) {

      // uint64le
      var br = new npwcore.encoding.BufferWriter();
      var num = Math.round(Math.random() * 10000000000000);
      br.writeUInt64LEBN(new npwcore.crypto.BN(num));
      buffers.push(br.toBuffer());

      // hashes
      var data = npwcore.crypto.Hash.sha256sha256(new Buffer(32));
      hashBuffers.push(data);
    }

    var c = 0;
    var bn;

    function readUInt64LEBN() {
      if (c >= buffers.length) {
        c = 0;
      }
      var buf = buffers[c];
      var br = new npwcore.encoding.BufferReader(buf);
      bn = br.readUInt64LEBN();
      c++;
    }

    var reversed;

    function readReverse() {
      if (c >= hashBuffers.length) {
        c = 0;
      }
      var buf = hashBuffers[c];
      var br = new npwcore.encoding.BufferReader(buf);
      reversed = br.readReverse();
      c++;
    }

    console.log('Starting benchmark...');

    var suite = new benchmark.Suite();
    suite.add('bufferReader.readUInt64LEBN()', readUInt64LEBN, {maxTime: maxTime});
    suite.add('bufferReader.readReverse()', readReverse, {maxTime: maxTime});
    suite
      .on('cycle', function(event) {
        console.log(String(event.target));
      })
      .on('complete', function() {
        console.log('Done');
        console.log('----------------------------------------------------------------------');
        next();
      })
      .run();
  },
  function(next) {

    var block1;

    function npwcoreTest() {
      block1 = npwcore.Block.fromString(blockData);
    }

    var suite = new benchmark.Suite();
    suite.add('npwcore', npwcoreTest, {maxTime: maxTime});
    suite
      .on('cycle', function(event) {
        console.log(String(event.target));
      })
      .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        console.log('----------------------------------------------------------------------');
        next();
      })
      .run();
  }
], function(err) {
  console.log('Finished');
});
