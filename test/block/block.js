'use strict';

var npwcore = require('../..');
var BN = require('../../lib/crypto/bn');
var BufferReader = npwcore.encoding.BufferReader;
var BufferWriter = npwcore.encoding.BufferWriter;
var BlockHeader = npwcore.BlockHeader;
var Block = npwcore.Block;
var chai = require('chai');
var fs = require('fs');
var should = chai.should();
var Transaction = npwcore.Transaction;

// http://explorer.npw.live:8080/block/21628766291638f9e31e62d02ba5fb3f00a37b9c9a15c30764904d1db9ff6b2f
var dataRawBlockBuffer = fs.readFileSync('test/data/blk23628.dat');
var dataRawBlockBinary = fs.readFileSync('test/data/blk23628.dat', 'binary');
var dataJson = fs.readFileSync('test/data/blk23628.json').toString();
var data = require('../data/blk23628');
var dataBlocks = require('../data/npwd/blocks');

describe('Block', function() {
  var blockhex;
  var blockbuf;
  var bh;
  var txs = [];
  var json;
  var genesishex;
  var genesisbuf;
  var genesisidhex;
  var blockOneHex;
  var blockOneBuf;
  var blockOneId;

  before(function () {
    blockhex = data.blockhex;
    blockbuf = new Buffer(blockhex, 'hex');
    bh = BlockHeader.fromBuffer(new Buffer(data.blockheaderhex, 'hex'));
    txs = [];
    JSON.parse(dataJson).transactions.forEach(function(tx) {
      txs.push(new Transaction().fromObject(tx));
    });
    json = dataJson;

    genesishex = '03000000114d2af8c7ed43e186b3e518330c56f71d06ab24952b235daeebe980ae02000020fe64baaa67761673671cea65773fcad62e68c1b135b00529b560e416208c121ef7075bffff0f1e486d010000000000000000000000000000000000000000000000000000000000000000000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff03510101ffffffff0100c05773a57c0200232103ef52e792114e7a097a42c30c54d004956f7c78ba1df710702b9a37a46d602168ac00000000';
    genesisbuf = new Buffer(genesishex, 'hex');
    genesisidhex = '00000dd955900a094ae8b426b4b0839ec3af15bc8547932618b7152dc570c66d';
    blockOneHex = '030000006dc670c52d15b71826934785bc15afc39e83b0b426b4e84a090a9055d90d0000d06f9a73dd448954dcf9da16bdfeea92e34bc253dfa6791e7ec95b968a219ed613f8075bffff0f1e9fbb070000000000000000000000000000000000000000000000000000000000000000000101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff03520102ffffffff0100e1f5050000000023210259c24e2d3fc3a3bd7f721d39910b44f1c6ab14fd3791e82a0bba901cf1ffd940ac00000000';
    blockOneBuf = new Buffer(blockOneHex, 'hex');
    blockOneId = '00000b5a58547d573a0d7cf675c2426db49a7b12ffbde37d928cc74928482368';
  });

  it('should make a new block', function() {
    var b = Block(blockbuf);
    b.toBuffer().toString('hex').should.equal(blockhex);
  });

  it('should not make an empty block', function() {
    (function() {
      return new Block();
    }).should.throw('Unrecognized argument for Block');
  });

  describe('#constructor', function() {

    it('should set these known values', function() {
      var b = new Block({
        header: bh,
        transactions: txs
      });
      should.exist(b.header);
      should.exist(b.transactions);
    });

    it('should properly deserialize blocks', function() {
      dataBlocks.forEach(function(block) {
        var b = Block.fromBuffer(new Buffer(block.data, 'hex'));
        b.transactions.length.should.equal(block.transactions);
      });
    });

  });

  describe('#fromRawBlock', function() {

    it('should instantiate from a raw block binary', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      x.header.version.should.equal(4);
      new BN(x.header.bits).toString('hex').should.equal('1b139a6b');
    });

    it('should instantiate from raw block buffer', function() {
      var x = Block.fromRawBlock(dataRawBlockBuffer);
      x.header.version.should.equal(4);
      new BN(x.header.bits).toString('hex').should.equal('1b139a6b');
    });

  });

  describe('#fromJSON', function() {

    it('should set these known values', function() {
      var block = Block.fromObject(JSON.parse(json));
      should.exist(block.header);
      should.exist(block.transactions);
    });

    it('should set these known values', function() {
      var block = new Block(JSON.parse(json));
      should.exist(block.header);
      should.exist(block.transactions);
    });

  });

  describe('#toJSON', function() {

    it('should recover these known values', function() {
      var block = Block.fromObject(JSON.parse(json));
      var b = block.toJSON();
      should.exist(b.header);
      should.exist(b.transactions);
    });

  });

  describe('#fromString/#toString', function() {

    it('should output/input a block hex string', function() {
      var b = Block.fromString(blockhex);
      b.toString().should.equal(blockhex);
    });

  });

  describe('#fromBuffer', function() {

    it('should make a block from this known buffer', function() {
      var block = Block.fromBuffer(blockbuf);
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

    it('should instantiate from block buffer from the network', function() {
      var networkBlock = '04000000260a55002c672906ba2476e85e24142fcd25d12e97bf41d364e75f9a95ee871270e410765c27276db670331e6c136917b5a2d5c219a776f6c6d97ab590a8e20964d3355b6b9a131b0000000075ff3189b26ba16561f218c675ff3189c27ffa3a75ff318975ff318975ff31890301000000010000000000000000000000000000000000000000000000000000000000000000ffffffff05024c5c0101ffffffff01000000000000000000000000000100000001a879f0a00998f1df580dbecb0e6890ab3a9e3e286a068b0377af16a8b9932fb5000000006a47304402205c6c192c668d635d51163caa192749ab6f653b78635e23551210b0961217fe04022001f7de7ec1609104cb8e42870acda85faa481c57fd3a5daaea2413d3f1495b3e012102f038bb38ff204d2590c17662976a8b1d5a257301ea83881e2a0c8c3bcbe4606affffffff03000000000000000000b05af25f16000000232102f038bb38ff204d2590c17662976a8b1d5a257301ea83881e2a0c8c3bcbe4606aac0050d6dc010000001976a9146544eb008c10705b2f5ec3625437579e11e4c68588ac00000000010000000493ec65d9a9351fe680a8a8ae18f2b3bcb24710beabc4e61509bb1028c2e5ce7b000000006b483045022100c5bf1280199a323ff635b1967fd72537114ddf634b6a80d362a975e14b5834380220450775460c55fd7d0d88d6c877541bace608312ca90b98c82b642e0fd346253d012103fd227c9c9e38d33745458c2cde3c5578b5c0a38678969375ef1f782cfc31c23fffffffff93627e6e8c21e1bf248607c9a1f94119b9bd4542ea4ec7d7d146f48ae3e9ab400d0000006a47304402203895cae67501e7cad1e33f114b106a45eabee4f9497e7a645de29ceb4446f6dc02204b1261203f208c1b9a3f501ae769540bdf010c58e46140596cfbc328bcd7c2ef01210372ed2d4b27f9bfa68ebe5e86cb6ddf9b69d3d5016136df2b378e71cea23c58bfffffffff19e6c72692a736856be0902d1a43782263fe73a9e36ec3a13205fbbe8666e0850e0000006a47304402201ae8426e1bd70f0c23380edae2659c27351b5cbd8baa1557df0644770caad14e02205fcf2beb555f3fae112d4cd6cf8fe420c4ad43e86e9b907e76684e3956fba9eb01210372ed2d4b27f9bfa68ebe5e86cb6ddf9b69d3d5016136df2b378e71cea23c58bfffffffff673aa8bfcb058482c004420d6735f0dd3cdddc286f0cc414da804dc9072e4b08050000006b4830450221009e7208007c77a65e6ee1ec50063d3d49e061553ba290da80e83433a88de1d9cf02207fb3d8188fef1e21f9b19ab3728580b833dc01d4ed54e36ae071a91355d47f2d01210372ed2d4b27f9bfa68ebe5e86cb6ddf9b69d3d5016136df2b378e71cea23c58bfffffffff01e2219119000000001976a9142c1a84a8844ccda501dc30da5a5178f3691af6ed88ac00000000';
      var x = Block.fromBuffer(Buffer(networkBlock, 'hex'));
      x.toBuffer().toString('hex').should.equal(networkBlock);
    });

  });

  describe('#fromBufferReader', function() {

    it('should make a block from this known buffer', function() {
      var block = Block.fromBufferReader(BufferReader(blockbuf));
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#toBuffer', function() {

    it('should recover a block from this known buffer', function() {
      var block = Block.fromBuffer(blockbuf);
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#toBufferWriter', function() {

    it('should recover a block from this known buffer', function() {
      var block = Block.fromBuffer(blockbuf);
      block.toBufferWriter().concat().toString('hex').should.equal(blockhex);
    });

    it('doesn\'t create a bufferWriter if one provided', function() {
      var writer = new BufferWriter();
      var block = Block.fromBuffer(blockbuf);
      block.toBufferWriter(writer).should.equal(writer);
    });

  });

  describe('#toObject', function() {

    it('should recover a block from genesis block buffer', function() {
      var block = Block.fromBuffer(blockOneBuf);
      block.id.should.equal(blockOneId);
      block.toObject().should.deep.equal({
        header:
        {
          hash: '00000b5a58547d573a0d7cf675c2426db49a7b12ffbde37d928cc74928482368',
          version: 3,
          prevHash: '00000dd955900a094ae8b426b4b0839ec3af15bc8547932618b7152dc570c66d',
          merkleRoot: 'd69e218a965bc97e1e79a6df53c24be392eafebd16daf9dc548944dd739a6fd0',
          time: 1527248915,
          bits: 504365055,
          nonce: 506783,
          accumulatorCheckpoint: '0000000000000000000000000000000000000000000000000000000000000000'
        },
        transactions: [{
          hash: 'd69e218a965bc97e1e79a6df53c24be392eafebd16daf9dc548944dd739a6fd0',
          version: 1,
          inputs:
            [{
              prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
              outputIndex: 4294967295,
              sequenceNumber: 4294967295,
              script: '520102',
              scriptString: 'OP_2 1 0x02'
            }],
          outputs:
            [{
              satoshis: 100000000,
              script: '210259c24e2d3fc3a3bd7f721d39910b44f1c6ab14fd3791e82a0bba901cf1ffd940ac'
            }],
          nLockTime: 0
        }]
      });
    });

    it('roundtrips correctly', function() {
      var block = Block.fromBuffer(blockOneBuf);
      var obj = block.toObject();
      var block2 = Block.fromObject(obj);
      block2.toObject().should.deep.equal(block.toObject());
    });

  });

  describe('#_getHash', function() {

    it('should return the correct hash of the genesis block', function() {
      var block = Block.fromBuffer(genesisbuf);
      var blockhash = new Buffer(Array.apply([], new Buffer(genesisidhex, 'hex')).reverse());
      block._getHash().toString('hex').should.equal(blockhash.toString('hex'));
    });
  });

  describe('#id', function() {

    it('should return the correct id of the genesis block', function() {
      var block = Block.fromBuffer(genesisbuf);
      block.id.should.equal(genesisidhex);
    });
    it('"hash" should be the same as "id"', function() {
      var block = Block.fromBuffer(genesisbuf);
      block.id.should.equal(block.hash);
    });

  });

  describe('#inspect', function() {

    it('should return the correct inspect of the genesis block', function() {
      var block = Block.fromBuffer(genesisbuf);
      block.inspect().should.equal('<Block ' + genesisidhex + '>');
    });

  });

  describe('#merkleRoot', function() {

    it('should describe as valid merkle root', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      var valid = x.validMerkleRoot();
      valid.should.equal(true);
    });

    it('should describe as invalid merkle root', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      x.transactions.push(new Transaction());
      var valid = x.validMerkleRoot();
      valid.should.equal(false);
    });

    it('should get a null hash merkle root', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      x.transactions = []; // empty the txs
      var mr = x.getMerkleRoot();
      mr.should.deep.equal(Block.Values.NULL_HASH);
    });

  });

});
