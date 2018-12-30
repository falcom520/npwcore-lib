# NPW URIs
Represents a npw payment URI. NPW URI strings became the most popular way to share payment request, sometimes as a npw link and others using a QR code.

URI Examples:

```
npw:NM4yYjToE4es3bokrUVhNE2n5w4QQ4ExRL
npw:NM4yYjToE4es3bokrUVhNE2n5w4QQ4ExRL?amount=1.2
npw:NM4yYjToE4es3bokrUVhNE2n5w4QQ4ExRL?amount=1.2&message=Payment&label=Satoshi&extra=other-param
```

## URI Validation
The main use that we expect you'll have for the `URI` class in npwcore is validating and parsing bitcoin URIs. A `URI` instance exposes the address as a npwcore `Address` object and the amount in Satoshis, if present.

The code for validating URIs looks like this:

```javascript
var uriString = 'npw:NM4yYjToE4es3bokrUVhNE2n5w4QQ4ExRL?amount=1.2';
var valid = URI.isValid(uriString);
var uri = new URI(uriString);
console.log(uri.address.network, uri.amount); // 'livenet', 120000000
```

## URI Parameters
All standard parameters can be found as members of the `URI` instance. However a npw URI may contain other non-standard parameters, all those can be found under the `extra` namespace.

See [the official BIP21 spec](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki) for more information.

## Create URI
Another important use case for the `URI` class is creating a npw URI for sharing a payment request. That can be accomplished by using a dictionary to create an instance of URI.

The code for creating an URI from an Object looks like this:

```javascript
var uriString = new URI({
  address: 'NM4yYjToE4es3bokrUVhNE2n5w4QQ4ExRL',
  amount : 10000, // in satoshis
  message: 'My payment request'
});
var uriString = uri.toString();
```
