'use strict';

module.exports = {
  TXHEX: [
    [ // From Mainnet Block 100014
      // From: http://btc.blockr.io/api/v1/tx/raw/652b0aa4cf4f17bdb31f7a1d308331bba91f3b3cbf8f39c9cb5e19d4015b9f01
      "0100000001834537b2f1ce8ef9373a258e10545ce5a50b758df616cd4356e0032554ebd3c4000000008b483045022100e68f422dd7c34fdce11eeb4509ddae38201773dd62f284e8aa9d96f85099d0b002202243bd399ff96b649a0fad05fa759d6a882f0af8c90cf7632c2840c29070aec20141045e58067e815c2f464c6a2a15f987758374203895710c2d452442e28496ff38ba8f5fd901dc20e29e88477167fe4fc299bf818fd0d9e1632d467b2a3d9503b1aaffffffff0280d7e636030000001976a914f34c3e10eb387efe872acb614c89e78bfca7815d88ac404b4c00000000001976a914a84e272933aaf87e1715d7786c51dfaeb5b65a6f88ac00000000"
    ],
  ],
  HEX: [
    // Mainnet Block 100014
    "04000000" + // Version
      "82bb869cf3a793432a66e826e05a6fc37469f8efb7421dc88067010000000000" + // prevHash
      "7f16c5962e8bd963659c793ce370d95f093bc7e367117b3c30c1f8fdd0d97287" + // MerkleRoot
      "76381b4d" + // Time
      "4c86041b" + // Bits
      "554b8529" + // Nonce
      "75ff3189b26ba16561f218c675ff3189c27ffa3a75ff318975ff318975ff3189" + // AccumulatorCheckpoint
      "07000000" + // Transaction Count
      "04" + // Hash Count
      "3612262624047ee87660be1a707519a443b1c1ce3d248cbfc6c15870f6c5daa2" + // Hash1
      "019f5b01d4195ecbc9398fbf3c3b1fa9bb3183301d7a1fb3bd174fcfa40a2b65" + // Hash2
      "41ed70551dd7e841883ab8f0b16bf04176b7d1480e4f0af9f3d4c3595768d068" + // Hash3
      "20d2a7bc994987302e5b1ac80fc425fe25f8b63169ea78e68fbaaefa59379bbf" + // Hash4
      "01" + // Num Flag Bytes
      "1d" // Flags
  ],
  JSON: [
    { // manmade block
      header: {
        hash: "367c33915475600c80ef31f139ea74b77393272dd934ddb253eff636f7923ef0",
        version: 4,
        prevHash: "0000000000016780c81d42b7eff86974c36f5ae026e8662a4393a7f39c86bb82",
        merkleRoot: "8772d9d0fdf8c1303c7b1167e3c73b095fd970e33c799c6563d98b2e96c5167f",
        time: 1293629558,
        bits: 453281356,
        nonce: 696601429,
        accumulatorCheckpoint: "8931ff758931ff758931ff753afa7fc28931ff75c618f26165a16bb28931ff75"
      },
      numTransactions: 7,
      hashes: [
        "3612262624047ee87660be1a707519a443b1c1ce3d248cbfc6c15870f6c5daa2",
        "019f5b01d4195ecbc9398fbf3c3b1fa9bb3183301d7a1fb3bd174fcfa40a2b65",
        "41ed70551dd7e841883ab8f0b16bf04176b7d1480e4f0af9f3d4c3595768d068",
        "20d2a7bc994987302e5b1ac80fc425fe25f8b63169ea78e68fbaaefa59379bbf"
      ],
      flags: [ 29 ]
    },
    { // Mainnet Block 12363
      header: {
        hash: "0000000000768087d62ae767d8867b5dc8ef62c56dce76d4143012e623573cf3",
        version: 3,
        prevHash: "00000000002e4d11068d19051dbcd72172a9f855ab558e524945eabf70afa180",
        merkleRoot: "5bdc79f29a40377786db4d2a57aee5b695256252d6cb214ca971cd5397166c93",
        time: 1528806742,
        nonce: 3478156203,
        bits: 469836033,
        accumulatorCheckpoint: '0000000000000000000000000000000000000000000000000000000000000000'
      },
      numTransactions: 1,
      hashes: [
        "936c169753cd71a94c21cbd652622595b6e5ae572a4ddb867737409af279dc5b"
      ],
      flags: [ 0 ]
    }
  ]
};
