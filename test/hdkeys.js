'use strict';

// Relax some linter options:
//   * quote marks so "m/0'/1/2'/" doesn't need to be scaped
//   * too many tests, maxstatements -> 100
//   * store test vectors at the end, latedef: false
//   * should call is never defined
/* jshint quotmark: false */
/* jshint latedef: false */
/* jshint maxstatements: 100 */
/* jshint unused: false */

var _ = require('lodash');
var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var npwcore = require('..');
var Networks = npwcore.Networks;
var HDPrivateKey = npwcore.HDPrivateKey;
var HDPublicKey = npwcore.HDPublicKey;

describe('HDKeys building with static methods', function() {
  var classes = [HDPublicKey, HDPrivateKey];
  var clazz, index;

  _.each(classes, function(clazz) {
    var expectStaticMethodFail = function(staticMethod, argument, message) {
      expect(clazz[staticMethod].bind(null, argument)).to.throw(message);
    };
    it(clazz.name + ' fromJSON checks that a valid JSON is provided', function() {
      var errorMessage = 'Invalid Argument: No valid argument was provided';
      var method = 'fromObject';
      expectStaticMethodFail(method, undefined, errorMessage);
      expectStaticMethodFail(method, null, errorMessage);
      expectStaticMethodFail(method, 'invalid JSON', errorMessage);
      expectStaticMethodFail(method, '{\'singlequotes\': true}', errorMessage);
    });
    it(clazz.name + ' fromString checks that a string is provided', function() {
      var errorMessage = 'No valid string was provided';
      var method = 'fromString';
      expectStaticMethodFail(method, undefined, errorMessage);
      expectStaticMethodFail(method, null, errorMessage);
      expectStaticMethodFail(method, {}, errorMessage);
    });
    it(clazz.name + ' fromObject checks that an object is provided', function() {
      var errorMessage = 'No valid argument was provided';
      var method = 'fromObject';
      expectStaticMethodFail(method, undefined, errorMessage);
      expectStaticMethodFail(method, null, errorMessage);
      expectStaticMethodFail(method, '', errorMessage);
    });
  });
});

describe('BIP32 compliance', function() {

  it('should initialize test vector 1 from the extended public key', function() {
    new HDPublicKey(vector1_m_public).xpubkey.should.equal(vector1_m_public);
  });

  it('should initialize test vector 1 from the extended private key', function() {
    new HDPrivateKey(vector1_m_private).xprivkey.should.equal(vector1_m_private);
  });

  it('can initialize a public key from an extended private key', function() {
    new HDPublicKey(vector1_m_private).xpubkey.should.equal(vector1_m_public);
  });

  it('toString should be equal to the `xpubkey` member', function() {
    var privateKey = new HDPrivateKey(vector1_m_private);
    privateKey.toString().should.equal(privateKey.xprivkey);
  });

  it('toString should be equal to the `xpubkey` member', function() {
    var publicKey = new HDPublicKey(vector1_m_public);
    publicKey.toString().should.equal(publicKey.xpubkey);
  });

  it('should get the extended public key from the extended private key for test vector 1', function() {
    HDPrivateKey(vector1_m_private).xpubkey.should.equal(vector1_m_public);
  });

  it("should get m/0' ext. private key from test vector 1", function() {
    var privateKey = new HDPrivateKey(vector1_m_private).derive("m/0'");
    privateKey.xprivkey.should.equal(vector1_m0h_private);
  });

  it("should get m/0' ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'")
      .xpubkey.should.equal(vector1_m0h_public);
  });

  it("should get m/0'/1 ext. private key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1")
      .xprivkey.should.equal(vector1_m0h1_private);
  });

  it("should get m/0'/1 ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1")
      .xpubkey.should.equal(vector1_m0h1_public);
  });

  it("should get m/0'/1 ext. public key from m/0' public key from test vector 1", function() {
    var derivedPublic = HDPrivateKey(vector1_m_private).derive("m/0'").hdPublicKey.derive("m/1");
    derivedPublic.xpubkey.should.equal(vector1_m0h1_public);
  });

  it("should get m/0'/1/2' ext. private key from test vector 1", function() {
    var privateKey = new HDPrivateKey(vector1_m_private);
    var derived = privateKey.derive("m/0'/1/2'");
    derived.xprivkey.should.equal(vector1_m0h12h_private);
  });

  it("should get m/0'/1/2' ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'")
      .xpubkey.should.equal(vector1_m0h12h_public);
  });

  it("should get m/0'/1/2'/2 ext. private key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2")
      .xprivkey.should.equal(vector1_m0h12h2_private);
  });

  it("should get m/0'/1/2'/2 ext. public key from m/0'/1/2' public key from test vector 1", function() {
    var derived = HDPrivateKey(vector1_m_private).derive("m/0'/1/2'").hdPublicKey;
    derived.derive("m/2").xpubkey.should.equal(vector1_m0h12h2_public);
  });

  it("should get m/0'/1/2h/2 ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2")
      .xpubkey.should.equal(vector1_m0h12h2_public);
  });

  it("should get m/0'/1/2h/2/1000000000 ext. private key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2/1000000000")
      .xprivkey.should.equal(vector1_m0h12h21000000000_private);
  });

  it("should get m/0'/1/2h/2/1000000000 ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2/1000000000")
      .xpubkey.should.equal(vector1_m0h12h21000000000_public);
  });

  it("should get m/0'/1/2'/2/1000000000 ext. public key from m/0'/1/2'/2 public key from test vector 1", function() {
    var derived = HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2").hdPublicKey;
    derived.derive("m/1000000000").xpubkey.should.equal(vector1_m0h12h21000000000_public);
  });

  it('should initialize test vector 2 from the extended public key', function() {
    HDPublicKey(vector2_m_public).xpubkey.should.equal(vector2_m_public);
  });

  it('should initialize test vector 2 from the extended private key', function() {
    HDPrivateKey(vector2_m_private).xprivkey.should.equal(vector2_m_private);
  });

  it('should get the extended public key from the extended private key for test vector 2', function() {
    HDPrivateKey(vector2_m_private).xpubkey.should.equal(vector2_m_public);
  });

  it("should get m/0 ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive(0).xprivkey.should.equal(vector2_m0_private);
  });

  it("should get m/0 ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive(0).xpubkey.should.equal(vector2_m0_public);
  });

  it("should get m/0 ext. public key from m public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).hdPublicKey.derive(0).xpubkey.should.equal(vector2_m0_public);
  });

  it("should get m/0/2147483647h ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'")
      .xprivkey.should.equal(vector2_m02147483647h_private);
  });

  it("should get m/0/2147483647h ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'")
      .xpubkey.should.equal(vector2_m02147483647h_public);
  });

  it("should get m/0/2147483647h/1 ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1")
      .xprivkey.should.equal(vector2_m02147483647h1_private);
  });

  it("should get m/0/2147483647h/1 ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1")
      .xpubkey.should.equal(vector2_m02147483647h1_public);
  });

  it("should get m/0/2147483647h/1 ext. public key from m/0/2147483647h public key from test vector 2", function() {
    var derived = HDPrivateKey(vector2_m_private).derive("m/0/2147483647'").hdPublicKey;
    derived.derive(1).xpubkey.should.equal(vector2_m02147483647h1_public);
  });

  it("should get m/0/2147483647h/1/2147483646h ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'")
      .xprivkey.should.equal(vector2_m02147483647h12147483646h_private);
  });

  it("should get m/0/2147483647h/1/2147483646h ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'")
      .xpubkey.should.equal(vector2_m02147483647h12147483646h_public);
  });

  it("should get m/0/2147483647h/1/2147483646h/2 ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'/2")
      .xprivkey.should.equal(vector2_m02147483647h12147483646h2_private);
  });

  it("should get m/0/2147483647h/1/2147483646h/2 ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'/2")
      .xpubkey.should.equal(vector2_m02147483647h12147483646h2_public);
  });

  it("should get m/0/2147483647h/1/2147483646h/2 ext. public key from m/0/2147483647h/2147483646h public key from test vector 2", function() {
    var derivedPublic = HDPrivateKey(vector2_m_private)
      .derive("m/0/2147483647'/1/2147483646'").hdPublicKey;
    derivedPublic.derive("m/2")
      .xpubkey.should.equal(vector2_m02147483647h12147483646h2_public);
  });

  it('should use full 32 bytes for private key data that is hashed (as per bip32)', function() {
    var privateKeyBuffer = new Buffer('00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd', 'hex');
    var chainCodeBuffer = new Buffer('9c8a5c863e5941f3d99453e6ba66b328bb17cf0b8dec89ed4fc5ace397a1c089', 'hex');
    var key = HDPrivateKey.fromObject({
      network: 'testnet',
      depth: 0,
      parentFingerPrint: 0,
      childIndex: 0,
      privateKey: privateKeyBuffer,
      chainCode: chainCodeBuffer
    });
    var derived = key.deriveChild("m/44'/0'/0'/0/0'");
    derived.privateKey.toString().should.equal('3348069561d2a0fb925e74bf198762acc47dce7db27372257d2d959a9e6f8aeb');
  });

  it('should NOT use full 32 bytes for private key data that is hashed with nonCompliant flag', function() {
    // This is to test that the previously implemented non-compliant to BIP32
    var privateKeyBuffer = new Buffer('00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd', 'hex');
    var chainCodeBuffer = new Buffer('9c8a5c863e5941f3d99453e6ba66b328bb17cf0b8dec89ed4fc5ace397a1c089', 'hex');
    var key = HDPrivateKey.fromObject({
      network: 'testnet',
      depth: 0,
      parentFingerPrint: 0,
      childIndex: 0,
      privateKey: privateKeyBuffer,
      chainCode: chainCodeBuffer
    });
    var derived = key.deriveNonCompliantChild("m/44'/0'/0'/0/0'");
    derived.privateKey.toString().should.equal('4811a079bab267bfdca855b3bddff20231ff7044e648514fa099158472df2836');
  });

  it('should NOT use full 32 bytes for private key data that is hashed with the nonCompliant derive method', function() {
    // This is to test that the previously implemented non-compliant to BIP32
    var privateKeyBuffer = new Buffer('00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd', 'hex');
    var chainCodeBuffer = new Buffer('9c8a5c863e5941f3d99453e6ba66b328bb17cf0b8dec89ed4fc5ace397a1c089', 'hex');
    var key = HDPrivateKey.fromObject({
      network: 'testnet',
      depth: 0,
      parentFingerPrint: 0,
      childIndex: 0,
      privateKey: privateKeyBuffer,
      chainCode: chainCodeBuffer
    });
    var derived = key.derive("m/44'/0'/0'/0/0'");
    derived.privateKey.toString().should.equal('4811a079bab267bfdca855b3bddff20231ff7044e648514fa099158472df2836');
  });

  describe('edge cases', function() {
    var sandbox = sinon.sandbox.create();
    afterEach(function() {
      sandbox.restore();
    });
    it('will handle edge case that derived private key is invalid', function() {
      var invalid = new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
      var privateKeyBuffer = new Buffer('5f72914c48581fc7ddeb944a9616389200a9560177d24f458258e5b04527bcd1', 'hex');
      var chainCodeBuffer = new Buffer('39816057bba9d952fe87fe998b7fd4d690a1bb58c2ff69141469e4d1dffb4b91', 'hex');
      var unstubbed = npwcore.crypto.BN.prototype.toBuffer;
      var count = 0;
      var stub = sandbox.stub(npwcore.crypto.BN.prototype, 'toBuffer').callsFake(function (args) {
        // On the fourth call to the function give back an invalid private key
        // otherwise use the normal behavior.
        count++;
        if (count === 4) {
          return invalid;
        }
        var ret = unstubbed.apply(this, arguments);
        return ret;
      });
      sandbox.spy(npwcore.PrivateKey, 'isValid');
      var key = HDPrivateKey.fromObject({
        network: 'testnet',
        depth: 0,
        parentFingerPrint: 0,
        childIndex: 0,
        privateKey: privateKeyBuffer,
        chainCode: chainCodeBuffer
      });
      var derived = key.derive("m/44'");
      derived.privateKey.toString().should.equal('b15bce3608d607ee3a49069197732c656bca942ee59f3e29b4d56914c1de6825');
      npwcore.PrivateKey.isValid.callCount.should.equal(2);
    });
    it('will handle edge case that a derive public key is invalid', function() {
      var publicKeyBuffer = new Buffer('029e58b241790284ef56502667b15157b3fc58c567f044ddc35653860f9455d099', 'hex');
      var chainCodeBuffer = new Buffer('39816057bba9d952fe87fe998b7fd4d690a1bb58c2ff69141469e4d1dffb4b91', 'hex');
      var key = new HDPublicKey({
        network: 'testnet',
        depth: 0,
        parentFingerPrint: 0,
        childIndex: 0,
        chainCode: chainCodeBuffer,
        publicKey: publicKeyBuffer
      });
      var unstubbed = npwcore.PublicKey.fromPoint;
      npwcore.PublicKey.fromPoint = function() {
        npwcore.PublicKey.fromPoint = unstubbed;
        throw new Error('Point cannot be equal to Infinity');
      };
      sandbox.spy(key, '_deriveWithNumber');
      var derived = key.derive("m/44");
      key._deriveWithNumber.callCount.should.equal(2);
      key.publicKey.toString().should.equal('029e58b241790284ef56502667b15157b3fc58c567f044ddc35653860f9455d099');
    });
  });

  describe('seed', function() {

    it('should initialize a new BIP32 correctly from test vector 1 seed', function() {
      var seededKey = HDPrivateKey.fromSeed(vector1_master, Networks.livenet);
      seededKey.xprivkey.should.equal('TDt9EWvD5T5T44hAausq7S2QafMdmww67SNLbqgcqqXut31tNWTMnsNBdBubZdBb4kqWDA8i3GgmG1UUKnpQZuVfPJW8gGCCngutSDCpzzCA1k9');
      seededKey.xpubkey.should.equal('ToEA6epvY6iUs9r4RPeALb4xRpaocsDexznZXAm1sYHmXsjrUqU1VmBnZNbDcq8z2R5xGqrVi53qcEmioRL9VWK8T7MjCWYtvZqCnP2f2ViKyF3');
    });

    it('should initialize a new BIP32 correctly from test vector 2 seed', function() {
      var seededKey = HDPrivateKey.fromSeed(vector2_master, Networks.livenet);
      seededKey.xprivkey.should.equal('TDt9EWvD5T5T44hAaSjShNte86P5kEZFCVUV9csQD1A9pXf1jQtAHWbSxwL3R89ECBZxHt2BACmCzvKsb98jy8BgkZ8CNaTzExUefrtcvLRFSnf');
      seededKey.xpubkey.should.equal('ToEA6epvY6iUs9r4QvVmvXwByFcFb9qp43ti4wwoEhv1UNNyqjtozQR3u81fUHgbXYDFi1UJrdwEuFhmXZh1aHsZ14R4NM1wYiF88yY7AUGHLY7');
    });
  });
});

var vector1_master = '000102030405060708090a0b0c0d0e0f';
var vector1_m_public = 'ToEA6epvY6iUs9r4R5mvZQyK8EtsCsK1xZ6hEXrGFDKjQpAT8V28vb7LKuKhFM7zoxQ7CzWX7dE7mJNiqBw8t8PU91Bu8oAqabvg9xGoBzHZLxp';
var vector1_m_private = 'TDt9EWvD5T5T44hAac1bLFvmH5fhMx2T6zgUKCmsDWZskySV2A1VDhHjPie5CBJ8nZs7TKXmo5sy2eHhFCSwa4gxqpKBK9NEZaua11yXwhAQ2wp';
var vector1_m0h_public = 'ToEA6h6LXp1wxQy3ZgudmAqx1GzyXgsNLdahv9HADJhrP1MjVmKKLpeRT3g72cghZGJeDCo5yrmYVwSooauGqA7rCtedLRy6VuptftQMVd9h3VM';
var vector1_m0h_private = 'TDt9EZBd5ANv9Kp9jD9JY1oQA7mogmaoV5AUzpCmBbwzjAdmPSJfdvppWrzUySeUCHF5ANRUAPCqR18ZxxUfDey9dtPhP23NoYcTi2cPNoMUB6w';
var vector1_m0h1_public = 'ToEA6jGTjbZqM7r7Q8x5VRjpc1tdb4rULfJzrTwzoaUfKe9wjJpT4d4jQcaLSh9GyD1zAvR8mHDecXwHPte6JVHjtYUZddowyYqAJcw8ncLBfDe';
var vector1_m0h1_private = 'TDt9EbMkGwvoY2hDZfBkGGhGkrfTk9ZuV6tmw8sbmsiofoRycyooMjF8URtiPVqXoD27cTB9yCoGVi5z6tztLzm8R3t8to16sJPKNpvkun8rYcG';
var vector1_m0h12h_public = 'ToEA6msjn8Ph3zhXGJkAk29By1vmpDizcCtzC1Bg3umpVWXP9A1ZsNuAK48FziL7R5TJXSWsNfCFzUWFrDnP1aqGwzdQDXn64Vtr2JrGstysVAH';
var vector1_m0h12h_private = 'TDt9Edy2KUkfEuYdRpyqWs6e7rhbyJSRkeUmGg7H2D1xqfoR2pzvAV5ZNsSdwY49mSXc7vCYZfkBv7utL6jdw1gKY9KoFQZf2EdFz6fyYM6oD1B';
var vector1_m0h12h2_public = 'ToEA6p78cZWeEUNWLnDtSHMGrX65u31jEoDBdV4yJsJHox5zWFdvw9bXWdbBg3KVpsc2zke3WfgD3DQNQe8P6tGUfb6f8KLGtgng2zm82T6KJan';
var vector1_m0h12h2_private = 'TDt9EgCR9uscRPDcWJTZD8Jj1Mrv47jAPEnxi9zaHAYSA7N2PvdHEFmvaSuZcrTcE6w3BiLFBaykpwN3oHe68SDfjXuqeeekaKSy95993rNMzUu';
var vector1_m0h12h21000000000_public = 'ToEA6qpu6F7tMbkhs81LYpv1AE65hGb34J2DRjTXZ9gS22UVDP3KTZrBmjkFJsESg8gkUSvb21c1aR6y14XQCjmKWrFmzrkMhANJqxP3GenZSJd';
var vector1_m0h12h21000000000_private = 'TDt9EhvBdbUrYWbp2eF1KfsTK4rurMJUCjbzWQP8XSvaNBkX742fkg2aqZ4dFiEp9247o7jVxwxhfyuAoTeTfWEPrVZNz9QyhECgRQhVo1R47Ej';
var vector2_master = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542';
var vector2_m_public = 'ToEA6epvY6iUs9r4QhHFfa3baScdT4TSeBMWv7dzYA4ZPCHKRU3L6jtGkoVHbTCyXCm57YkK2HtHANsyYyfN1KJdGvBqzjNJR6RLUKwuTyjmv5e';
var vector2_m_private = 'TDt9EWvD5T5T44hAaDWvSR13jHPTc9AsncwHznZbWTJhjMZMK92gPr4fpcofYF5By5RChNHCYNLRJkKtLjB3cV5fTBdwmZSUhvpJaGbmJc39xAS';
var vector2_m0_public = 'ToEA6i6fopQSMAg8vxsYoMRUeF29p2ChM9qoUHPMhy61Tc9H7SVJg1ELue4YAvAsKHmWKsEUtWt2ZTiwi963tU13cWr8Gn6yKSZibp4ZuCFDqQD';
var vector2_m0_private = 'TDt9EaBxMAmQY5XF6V7DaCNvo5nyy6v8VbRaYxJxgGL9omRK17Uey7QjyTNv7kLzc9G372X2SNk9juk1hEosAmaiPQoLmjrY6Qz3hgWKfy7BcRy';
var vector2_m02147483647h_public = 'ToEA6jFj4RRxj4rF6q5jDoR87ahiCmRbte1VZSTtdMzn7LufZjimHtef7hr8nJQz52Nc7PA2YMjdrg9YNoxPfNVALfJkorj2gApjUCLAjzRSrz1';
var vector2_m02147483647h_private = 'TDt9EbM1bmnvuyhMGMKPzeNaGRUYMr9335bGe7PVbfEvTWBhTQi7azq4BXAWj6pyLPzX1FqvDPwnnvF88UYdu9BqxiEuCU5srviJVTqrSM8WfhM';
var vector2_m02147483647h1_public = 'ToEA6n4hUSQtti9SCSksHTZh5XdwYJJ6zpvkssxkURf7REG7EZavbQBN1cEWd6c7ru4thZcaNzpsVoTNTcDQaGv7bzmfQ8vstiFwPy17zPEAhLs';
var vector2_m02147483647h1_private = 'TDt9Ee9z1nms5czYMxzY4JX9ENQmhP1Y9GWXxYtMSiuFmPY98EaGtWMm5RYtZu2bN7CDKDCcxh2BCTvLTBKnx2iDyC4CLEcgi2ggyGGauzni6xJ';
var vector2_m02147483647h12147483646h_public = 'ToEA6oEjPQMFW779VPzU1wPET3L8T2mU3oZFuage19MXFzXMguurh57NY8bcFkjd4GbLf1GDBVtaYQnE7FNoGA2dKMU7g3FNT1MMGC5hXLLMMwA';
var vector2_m02147483647h12147483646h_private = 'TDt9EfL1vkiDh1xFevE8nnLgbt6xc7UuCF92zFcEySbfc9oPaauCzBHmbwuzCbkyzXaVrnVKGWoAaqVvGJRATycif2jNAB9zrEiKJrH6yj3CXGC';
var vector2_m02147483647h12147483646h2_public = 'ToEA6pbmLqZm2HRPEfBMk1WvRni6r6JaJ8ULZkJXQvi1tnNwm7FRri38ihYcL9ouBqx3B4USTRPzS7oDbgSJ6FiXdcKhKD5TPNe5wVGtC3N27Jk';
var vector2_m02147483647h12147483646h2_private = 'TDt9Egh3tBvjDCGVQBR2WrUNadUw1B21Sa47eRE8PDxAEweyenEn9pDXnWrzH1Rz9YfZu6M3ZGRz2wLcJrJgCHywi1U5y2fVuer31Dcf4Mqgck3';
