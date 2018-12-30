'use strict';

var npwcore = require('../..');
var BN = require('../../lib/crypto/bn');
var BufferReader = npwcore.encoding.BufferReader;
var BufferWriter = npwcore.encoding.BufferWriter;

var BlockHeader = npwcore.BlockHeader;
var fs = require('fs');
var should = require('chai').should();

// http://explorer.npw.live:8080/block/21628766291638f9e31e62d02ba5fb3f00a37b9c9a15c30764904d1db9ff6b2f
var dataRawBlockBuffer = fs.readFileSync('test/data/blk23628.dat');
var dataRawBlockBinary = fs.readFileSync('test/data/blk23628.dat', 'binary');
var dataRawId = '21628766291638f9e31e62d02ba5fb3f00a37b9c9a15c30764904d1db9ff6b2f';
var data = require('../data/blk23628');

describe('BlockHeader', function() {
  var version;
  var prevblockidbuf;
  var merklerootbuf;
  var time;
  var bits;
  var nonce;
  var accumulatorcheckpointbuf;
  var bh;
  var bhhex;
  var bhbuf;

  before(function () {
    version = data.version;
    prevblockidbuf = new Buffer(data.prevblockidhex, 'hex');
    merklerootbuf = new Buffer(data.merkleroothex, 'hex');
    time = data.time;
    bits = data.bits;
    nonce = data.nonce;
    accumulatorcheckpointbuf = new Buffer(data.accumulatorcheckpointhex, 'hex');
    bh = new BlockHeader({
      version: version,
      prevHash: prevblockidbuf,
      merkleRoot: merklerootbuf,
      time: time,
      bits: bits,
      nonce: nonce,
      accumulatorCheckpoint: accumulatorcheckpointbuf
    });
    bhhex = data.blockheaderhex;
    bhbuf = new Buffer(bhhex, 'hex');
  });

  it('should make a new blockheader', function() {
    BlockHeader(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
  });

  it('should not make an empty block', function() {
    (function() {
      BlockHeader();
    }).should.throw('Unrecognized argument for BlockHeader');
  });

  describe('#constructor', function() {

    it('should set all the variables', function() {
      var bh = new BlockHeader({
        version: version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time: time,
        bits: bits,
        nonce: nonce,
        accumulatorCheckpoint: accumulatorcheckpointbuf
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.bits);
      should.exist(bh.nonce);
      should.exist(bh.accumulatorCheckpoint);
    });

    it('will throw an error if the argument object hash property doesn\'t match', function() {
      (function() {
        var bh = new BlockHeader({
          hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
          version: version,
          prevHash: prevblockidbuf,
          merkleRoot: merklerootbuf,
          time: time,
          bits: bits,
          nonce: nonce,
          accumulatorCheckpoint: accumulatorcheckpointbuf
        });
      }).should.throw('Argument object hash property does not match block hash.');
    });

  });

  describe('version', function() {
    it('is interpreted as an int32le', function() {
      var hex = 'ffffffff00000000000000000000000000000000000000000000000000000000000000004141414141414141414141414141414141414141414141414141414141414141010000000200000003000000';
      var header = BlockHeader.fromBuffer(new Buffer(hex, 'hex'));
      header.version.should.equal(-1);
      header.timestamp.should.equal(1);
    });
  });


  describe('#fromObject', function() {

    it('should set all the variables', function() {
      var bh = BlockHeader.fromObject({
        version: version,
        prevHash: prevblockidbuf.toString('hex'),
        merkleRoot: merklerootbuf.toString('hex'),
        time: time,
        bits: bits,
        nonce: nonce,
        accumulatorCheckpoint: accumulatorcheckpointbuf.toString('hex')
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.bits);
      should.exist(bh.nonce);
      should.exist(bh.accumulatorCheckpoint);
    });

  });

  describe('#toJSON', function() {

    it('should set all the variables', function() {
      var json = bh.toJSON();
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.bits);
      should.exist(json.nonce);
      should.exist(json.accumulatorCheckpoint);
    });

  });

  describe('#fromJSON', function() {

    it('should parse this known json string', function() {

      var jsonString = JSON.stringify({
        version: version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time: time,
        bits: bits,
        nonce: nonce,
        accumulatorCheckpoint: accumulatorcheckpointbuf
      });

      var json = new BlockHeader(JSON.parse(jsonString));
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.bits);
      should.exist(json.nonce);
      should.exist(json.accumulatorCheckpoint);
    });

  });

  describe('#fromString/#toString', function() {

    it('should output/input a block hex string', function() {
      var b = BlockHeader.fromString(bhhex);
      b.toString().should.equal(bhhex);
    });

  });

  describe('#fromBuffer', function() {

    it('should parse this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#fromBufferReader', function() {

    it('should parse this known buffer', function() {
      BlockHeader.fromBufferReader(BufferReader(bhbuf)).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#toBuffer', function() {

    it('should output this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#toBufferWriter', function() {

    it('should output this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBufferWriter().concat().toString('hex').should.equal(bhhex);
    });

    it('doesn\'t create a bufferWriter if one provided', function() {
      var writer = new BufferWriter();
      var blockHeader = BlockHeader.fromBuffer(bhbuf);
      blockHeader.toBufferWriter(writer).should.equal(writer);
    });

  });

  describe('#inspect', function() {

    it('should return the correct inspect of the genesis block', function() {
      var block = BlockHeader.fromRawBlock(dataRawBlockBinary);
      block.inspect().should.equal('<BlockHeader '+dataRawId+'>');
    });

  });

  describe('#fromRawBlock', function() {

    it('should instantiate from a raw block binary', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBinary);
      x.version.should.equal(4);
      new BN(x.bits).toString('hex').should.equal('1b139a6b');
    });

    it('should instantiate from raw block buffer', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.version.should.equal(4);
      new BN(x.bits).toString('hex').should.equal('1b139a6b');
    });

  });

  describe('#validTimestamp', function() {

    var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);

    it('should validate timpstamp as true', function() {
      var valid = x.validTimestamp(x);
      valid.should.equal(true);
    });


    it('should validate timestamp as false', function() {
      x.time = Math.round(new Date().getTime() / 1000) + BlockHeader.Constants.MAX_TIME_OFFSET + 100;
      var valid = x.validTimestamp(x);
      valid.should.equal(false);
    });

  });

  it('coverage: caches the "_id" property', function() {
      var blockHeader = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      blockHeader.id.should.equal(blockHeader.id);
  });

});
