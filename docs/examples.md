# Npwcore examples

## Generate a random address
```javascript
var privateKey = new npwcore.PrivateKey();

var address = privateKey.toAddress();
```

## Generate a address from a SHA256 hash
```javascript
var value = Buffer.from('correct horse battery staple');
var hash = npwcore.crypto.Hash.sha256(value);
var bn = npwcore.crypto.BN.fromBuffer(hash);

var address = new npwcore.PrivateKey(bn).toAddress();
```

## Import an address via WIF
```javascript
var wif = 'YPZ7uxVmrC1cXftLYeKeeGi5txvaFD47JP5rWcRsUDM6L68qVhvc';

var address = new npwcore.PrivateKey(wif).toAddress();
```

## Create a Transaction
```javascript
var privateKey = new npwcore.PrivateKey('YScwze72cBp3PKtPLHSXAJSuQed7m1b5o3W97ey42kXEtpurYTod');
var utxo = {
  "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
  "outputIndex" : 0,
  "address" : "NSS9urWWsSDa6xbwZePyPLzRBhB3sDrZvE",
  "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
  "satoshis" : 50000
};

var transaction = new npwcore.Transaction()
  .from(utxo)
  .to('NbiiwsqBinLLHHcmRQNPQQYj4huSZpKta1', 15000)
  .sign(privateKey);
```

## Sign a NPW message
```javascript
var Message = require('npwcore-message');

var privateKey = new npwcore.PrivateKey('YSkMrJ1k7kmi6Y37oeXgLB7Vwp8BJbN15DefnQZxEJwkUu5dWDDZ');
var message = new Message('This is an example of a signed message.');

var signature = message.sign(privateKey);
```

## Verify a NPW message
```javascript
var Message = require('npwcore-message');

var address = 'NNDqHxr6gtV6np4ufMzi5UVp3MEhVB4pSk';
var signature = 'IBOvIfsAs/da1e36W8kw1cQOPqPVXCW5zJgNQ5kI8m57FycZXdeFmeyoIqJSREzE4W7vfDmdmPk0HokuJPvgPPE=';

var verified = new Message('This is an example of a signed message.').verify(address, signature);
 ```

## Create an OP RETURN transaction
```javascript
var privateKey = new npwcore.PrivateKey('YScwze72cBp3PKtPLHSXAJSuQed7m1b5o3W97ey42kXEtpurYTod');
var utxo = {
  "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
  "outputIndex" : 0,
  "address" : "NSS9urWWsSDa6xbwZePyPLzRBhB3sDrZvE",
  "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
  "satoshis" : 50000
};

var transaction = new npwcore.Transaction()
    .from(utxo)
    .addData('npwcore rocks') // Add OP_RETURN data
    .sign(privateKey);
```

## Create a 2-of-3 multisig P2SH address
```javascript
var publicKeys = [
  '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
  '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
  '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
];
var requiredSignatures = 2;

var address = new npwcore.Address(publicKeys, requiredSignatures);
```

## Spend from a 2-of-2 multisig P2SH address
```javascript
var privateKeys = [
  new npwcore.PrivateKey('91avARGdfge8E4tZfYLoxeJ5sGBdNJQH4kvjJoQFacbgwmaKkrx'),
  new npwcore.PrivateKey('91avARGdfge8E4tZfYLoxeJ5sGBdNJQH4kvjJoQFacbgww7vXtT')
];
var publicKeys = privateKeys.map(npwcore.PublicKey);
var address = new npwcore.Address(publicKeys, 2); // 2 of 2

var utxo = {
  "txId" : "153068cdd81b73ec9d8dcce27f2c77ddda12dee3db424bff5cafdbe9f01c1756",
  "outputIndex" : 0,
  "address" : address.toString(),
  "script" : new npwcore.Script(address).toHex(),
  "satoshis" : 20000
};

var transaction = new npwcore.Transaction()
    .from(utxo, publicKeys, 2)
    .to('yAGDSBq714ShbcczjNSRAetQCsLpnnApXf', 20000)
    .sign(privateKeys);
```
