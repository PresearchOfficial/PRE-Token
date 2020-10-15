 const web3 = require('web3');

 const HDWalletProvider = require('@truffle/hdwallet-provider');

 const { INFURA_PROJECT_ID, 
         TEST_PRIVATE_KEYS, 
         MAINNET_PRIVATE_KEYS, 
         RINKEBY_PRIVATE_KEYS,
         ROPSTEN_PRIVATE_KEYS, 
         KOVAN_PRIVATE_KEYS } = require('./.secrets.json');

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    test: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: TEST_PRIVATE_KEYS, 
          providerOrUrl: "http://127.0.0.1:8545",
          addressIndex: 0,
          numberOfAddresses: 3
        })},
      network_id: 2017,
      skipDryRun:false
    },
    mainnet: {
        provider: function () {
            return new HDWalletProvider({
              privateKeys: MAINNET_PRIVATE_KEYS, 
              providerOrUrl: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
              numberOfAddresses: 3,
              derivationPath: "m/44'/60'/0'/0"
        })},
      network_id: 1,
      gasPrice: web3.utils.toWei("20", "gwei"),
      skipDryRun:false
    },
    ropsten: {
        provider: function () {
            return new HDWalletProvider({
              privateKeys: ROPSTEN_PRIVATE_KEYS, 
              providerOrUrl: "https://ropsten.infura.io/v3/" + INFURA_PROJECT_ID,
              numberOfAddresses: 3,
              derivationPath: "m/44'/60'/0'/0"
        })},
        network_id: 3,       // Ropsten's id
        gas: 5500000,        // Ropsten has a lower block limit than mainnet
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: false     // Skip dry run before migrations? (default: false for public net
    },
    rinkeby: {
      provider: function () {
      return new HDWalletProvider({
          privateKeys: RINKEBY_PRIVATE_KEYS, 
          providerOrUrl: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
          numberOfAddresses: 3,
          derivationPath: "m/44'/60'/0'/0"
        })},
      network_id: 4,
      skipDryRun:false
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: KOVAN_PRIVATE_KEYS, 
          providerOrUrl: "https://kovan.infura.io/v3/" + INFURA_PROJECT_ID,
          addressIndex: 0,
          numberOfAddresses: 3,
          //derivationPath: "m/44'/60'/0'/0"
        })},
      network_id: 42,
      skipDryRun:false
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.6.2",    // Fetch exact version from solc-bin (default: truffle's version)
       settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 1337
        }
      }
    }
  },
  plugins: [
    'truffle-flatten'
  ]
};