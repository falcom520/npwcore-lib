'use strict';

/* jshint unused: false */
var _ = require('lodash');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var npwcore = require('..');
var buffer = require('buffer');
var errors = npwcore.errors;
var hdErrors = npwcore.errors.HDPublicKey;
var BufferUtil = npwcore.util.buffer;
var HDPrivateKey = npwcore.HDPrivateKey;
var HDPublicKey = npwcore.HDPublicKey;
var Base58Check = npwcore.encoding.Base58Check;
var Networks = npwcore.Networks;

var xprivkey = 'TDt9EWvD5T5T44hAabk1AhkXeEPrArmSAvnLXxJ3863mGowr45fC8iuwpUNBsbysLzA7C9ftXrnb44LWDkyicS2wTv5nPfVwF3h5SaphfSGocWF';
var xpubkey = 'ToEA6epvY6iUs9r4R5WLPro5VPd21n412VCZTHNS9nocvefpAQfqqcjYkf3ovoe5rpm4zx5mtS8b7JMMDp3LJ9tM6qNjXrD3Zy1mewWWEMuTiwZ';
var xpubkeyTestnet = 'DRKVrRjogj3bNiLD8UEWnUxsd2Cm3NsJr5NKy4i6biSEKU6bhZrU44FZXhRQEuwLCLqrWcnWdGZ2qqSCzBW7iqeJSguWxB6CMNMC6gwjYTnMuvnj';
var json = '{"network":"livenet","depth":0,"fingerPrint":-927538211,"parentFingerPrint":0,"childIndex":0,"chainCode":"86c6d7792d54d235ca1a6c4e88d2ffe58554a3e5abc5070cab9fa0bae490758f","publicKey":"0370d8987a0d7fdf2e08e653350f59c4743608eb4e52a3f4f3ff498bc4ddf63515","checksum":223327664,"xpubkey":"ToEA6epvY6iUs9r4R5WLPro5VPd21n412VCZTHNS9nocvefpAQfqqcjYkf3ovoe5rpm4zx5mtS8b7JMMDp3LJ9tM6qNjXrD3Zy1mewWWEMuTiwZ"}'
var derived_0_1_200000 = 'ToEA6kUMQkfZ5jQQeBpCK2sfn81beojJCC17FeLzd2pxcUxBwHhnk9rJkYQ1DgFpSxh12QU4cfScTfpo7vYjKyyTUAWpk821gNVdvrJw3Px4DVM';

describe('HDPublicKey interface', function() {

  var expectFail = function(func, errorType) {
    (function() {
      func();
    }).should.throw(errorType);
  };

  var expectDerivationFail = function(argument, error) {
    (function() {
      var pubkey = new HDPublicKey(xpubkey);
      pubkey.derive(argument);
    }).should.throw(error);
  };

  var expectFailBuilding = function(argument, error) {
    (function() {
      return new HDPublicKey(argument);
    }).should.throw(error);
  };

  describe('creation formats', function() {

    it('returns same argument if already an instance of HDPublicKey', function() {
      var publicKey = new HDPublicKey(xpubkey);
      publicKey.should.equal(new HDPublicKey(publicKey));
    });

    it('returns the correct xpubkey for a xprivkey', function() {
      var publicKey = new HDPublicKey(xprivkey);
      publicKey.xpubkey.should.equal(xpubkey);
    });

    it('allows to call the argument with no "new" keyword', function() {
      HDPublicKey(xpubkey).xpubkey.should.equal(new HDPublicKey(xpubkey).xpubkey);
    });

    it('fails when user doesn\'t supply an argument', function() {
      expectFailBuilding(null, hdErrors.MustSupplyArgument);
    });

    it('should not be able to change read-only properties', function() {
      var publicKey = new HDPublicKey(xprivkey);
      expect(function() {
        publicKey.fingerPrint = 'notafingerprint';
      }).to.throw(TypeError);
    });

    it('doesn\'t recognize an invalid argument', function() {
      expectFailBuilding(1, hdErrors.UnrecognizedArgument);
      expectFailBuilding(true, hdErrors.UnrecognizedArgument);
    });


    describe('xpubkey string serialization errors', function() {
      it('fails on invalid length', function() {
        expectFailBuilding(
          Base58Check.encode(new buffer.Buffer([1, 2, 3])),
          hdErrors.InvalidLength
        );
      });
      it('fails on invalid base58 encoding', function() {
        expectFailBuilding(
          xpubkey + '1',
          errors.InvalidB58Checksum
        );
      });
      it('user can ask if a string is valid', function() {
        (HDPublicKey.isValidSerialized(xpubkey)).should.equal(true);
      });
    });

    it('can be generated from a json', function() {
      expect(new HDPublicKey(JSON.parse(json)).xpubkey).to.equal(xpubkey);
    });

    it('can generate a json that has a particular structure', function() {
      assert(_.isEqual(
        new HDPublicKey(JSON.parse(json)).toJSON(),
        new HDPublicKey(xpubkey).toJSON()
      ));
    });

    it('builds from a buffer object', function() {
      (new HDPublicKey(new HDPublicKey(xpubkey)._buffers)).xpubkey.should.equal(xpubkey);
    });

    it('checks the checksum', function() {
      var buffers = new HDPublicKey(xpubkey)._buffers;
      buffers.checksum = BufferUtil.integerAsBuffer(1);
      expectFail(function() {
        return new HDPublicKey(buffers);
      }, errors.InvalidB58Checksum);
    });
  });

  describe('error checking on serialization', function() {
    var compareType = function(a, b) {
      expect(a instanceof b).to.equal(true);
    };
    it('throws invalid argument when argument is not a string or buffer', function() {
      compareType(HDPublicKey.getSerializedError(1), hdErrors.UnrecognizedArgument);
    });
    it('if a network is provided, validates that data corresponds to it', function() {
      compareType(HDPublicKey.getSerializedError(xpubkey, 'testnet'), errors.InvalidNetwork);
    });
    it('recognizes invalid network arguments', function() {
      compareType(HDPublicKey.getSerializedError(xpubkey, 'invalid'), errors.InvalidNetworkArgument);
    });
    it('recognizes a valid network', function() {
      expect(HDPublicKey.getSerializedError(xpubkey, 'livenet')).to.equal(null);
    });
  });

  it('toString() returns the same value as .xpubkey', function() {
    var pubKey = new HDPublicKey(xpubkey);
    pubKey.toString().should.equal(pubKey.xpubkey);
  });

  it('publicKey property matches network', function() {
    var livenet = new HDPublicKey(xpubkey);
    var testnet = new HDPublicKey(xpubkeyTestnet);

    livenet.publicKey.network.should.equal(Networks.livenet);
    testnet.publicKey.network.should.equal(Networks.testnet);
  });

  it('inspect() displays correctly', function() {
    var pubKey = new HDPublicKey(xpubkey);
    pubKey.inspect().should.equal('<HDPublicKey: ' + pubKey.xpubkey + '>');
  });

  describe('conversion to/from buffer', function() {

    it('should roundtrip to an equivalent object', function() {
      var pubKey = new HDPublicKey(xpubkey);
      var toBuffer = pubKey.toBuffer();
      var fromBuffer = HDPublicKey.fromBuffer(toBuffer);
      var roundTrip = new HDPublicKey(fromBuffer.toBuffer());
      roundTrip.xpubkey.should.equal(xpubkey);
    });
  });

  describe('conversion to different formats', function() {
    var plainObject = {
      'network': 'livenet',
      'depth': 0,
      'fingerPrint': -927538211,
      'parentFingerPrint': 0,
      'childIndex': 0,
      'chainCode': '86c6d7792d54d235ca1a6c4e88d2ffe58554a3e5abc5070cab9fa0bae490758f',
      'publicKey': '0370d8987a0d7fdf2e08e653350f59c4743608eb4e52a3f4f3ff498bc4ddf63515',
      'checksum': 223327664,
      'xpubkey': 'ToEA6epvY6iUs9r4R5WLPro5VPd21n412VCZTHNS9nocvefpAQfqqcjYkf3ovoe5rpm4zx5mtS8b7JMMDp3LJ9tM6qNjXrD3Zy1mewWWEMuTiwZ' 
    };
    it('roundtrips to JSON and to Object', function() {
      var pubkey = new HDPublicKey(xpubkey);
      expect(HDPublicKey.fromObject(pubkey.toJSON()).xpubkey).to.equal(xpubkey);
    });
    it('recovers state from Object', function() {
      new HDPublicKey(plainObject).xpubkey.should.equal(xpubkey);
    });
  });

  describe('derivation', function() {
    it('derivation is the same whether deriving with number or string', function() {
      var pubkey = new HDPublicKey(xpubkey);
      var derived1 = pubkey.derive(0).derive(1).derive(200000);
      var derived2 = pubkey.derive('m/0/1/200000');
      derived1.xpubkey.should.equal(derived_0_1_200000);
      derived2.xpubkey.should.equal(derived_0_1_200000);
    });

    it('allows special parameters m, M', function() {
      var expectDerivationSuccess = function(argument) {
        new HDPublicKey(xpubkey).derive(argument).xpubkey.should.equal(xpubkey);
      };
      expectDerivationSuccess('m');
      expectDerivationSuccess('M');
    });

    it('doesn\'t allow object arguments for derivation', function() {
      expectFail(function() {
        return new HDPublicKey(xpubkey).derive({});
      }, hdErrors.InvalidDerivationArgument);
    });

    it('needs first argument for derivation', function() {
      expectFail(function() {
        return new HDPublicKey(xpubkey).derive('s');
      }, hdErrors.InvalidPath);
    });

    it('doesn\'t allow other parameters like m\' or M\' or "s"', function() {
      /* jshint quotmark: double */
      expectDerivationFail("m'", hdErrors.InvalidIndexCantDeriveHardened);
      expectDerivationFail("M'", hdErrors.InvalidIndexCantDeriveHardened);
      expectDerivationFail("1", hdErrors.InvalidPath);
      expectDerivationFail("S", hdErrors.InvalidPath);
    });

    it('can\'t derive hardened keys', function() {
      expectFail(function() {
        return new HDPublicKey(xpubkey).derive(HDPublicKey.Hardened);
      }, hdErrors.InvalidIndexCantDeriveHardened);
    });

    it('can\'t derive hardened keys via second argument', function() {
      expectFail(function() {
        return new HDPublicKey(xpubkey).derive(5, true);
      }, hdErrors.InvalidIndexCantDeriveHardened);
    });

    it('validates correct paths', function() {
      var valid;

      valid = HDPublicKey.isValidPath('m/123/12');
      valid.should.equal(true);

      valid = HDPublicKey.isValidPath('m');
      valid.should.equal(true);

      valid = HDPublicKey.isValidPath(123);
      valid.should.equal(true);
    });

    it('rejects illegal paths', function() {
      var valid;

      valid = HDPublicKey.isValidPath('m/-1/12');
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath("m/0'/12");
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath("m/8000000000/12");
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath('bad path');
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath(-1);
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath(8000000000);
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath(HDPublicKey.Hardened);
      valid.should.equal(false);
    });
  });
});
