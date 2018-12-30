'use strict';

var npwcore = module.exports;

// module information
npwcore.version = 'v' + require('./package.json').version;
npwcore.versionGuard = function(version) {
  if (version !== undefined) {
    var message = 'More than one instance of npwcore-lib found. ' +
      'Please make sure to require npwcore-lib and check that submodules do' +
      ' not also include their own npwcore-lib dependency.';
    throw new Error(message);
  }
};
npwcore.versionGuard(global._npwcore);
global._npwcore = npwcore.version;

// crypto
npwcore.crypto = {};
npwcore.crypto.BN = require('./lib/crypto/bn');
npwcore.crypto.ECDSA = require('./lib/crypto/ecdsa');
npwcore.crypto.Hash = require('./lib/crypto/hash');
npwcore.crypto.Random = require('./lib/crypto/random');
npwcore.crypto.Point = require('./lib/crypto/point');
npwcore.crypto.Signature = require('./lib/crypto/signature');

// encoding
npwcore.encoding = {};
npwcore.encoding.Base58 = require('./lib/encoding/base58');
npwcore.encoding.Base58Check = require('./lib/encoding/base58check');
npwcore.encoding.BufferReader = require('./lib/encoding/bufferreader');
npwcore.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
npwcore.encoding.Varint = require('./lib/encoding/varint');

// utilities
npwcore.util = {};
npwcore.util.buffer = require('./lib/util/buffer');
npwcore.util.js = require('./lib/util/js');
npwcore.util.preconditions = require('./lib/util/preconditions');

// errors thrown by the library
npwcore.errors = require('./lib/errors');

// main npw library
npwcore.Address = require('./lib/address');
npwcore.Block = require('./lib/block');
npwcore.MerkleBlock = require('./lib/block/merkleblock');
npwcore.BlockHeader = require('./lib/block/blockheader');
npwcore.HDPrivateKey = require('./lib/hdprivatekey.js');
npwcore.HDPublicKey = require('./lib/hdpublickey.js');
npwcore.Networks = require('./lib/networks');
npwcore.Opcode = require('./lib/opcode');
npwcore.PrivateKey = require('./lib/privatekey');
npwcore.PublicKey = require('./lib/publickey');
npwcore.Script = require('./lib/script');
npwcore.Transaction = require('./lib/transaction');
npwcore.URI = require('./lib/uri');
npwcore.Unit = require('./lib/unit');

// dependencies, subject to change
npwcore.deps = {};
npwcore.deps.bnjs = require('bn.js');
npwcore.deps.bs58 = require('bs58');
npwcore.deps.Buffer = Buffer;
npwcore.deps.elliptic = require('elliptic');
npwcore.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking
npwcore.Transaction.sighash = require('./lib/transaction/sighash');
