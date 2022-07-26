const web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const {INFURA_PROJECT_ID, TEST_PRIVATE_KEYS, MAINNET_PRIVATE_KEYS, RINKEBY_PRIVATE_KEYS, ROPSTEN_PRIVATE_KEYS, KOVAN_PRIVATE_KEYS, GOERLI_PRIVATE_KEYS} = require('./.secrets.json');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    test: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: TEST_PRIVATE_KEYS,
          providerOrUrl: "http://127.0.0.1:8545",
          addressIndex: 0,
          numberOfAddresses: 3
        });
      },
      network_id: 2017,
      skipDryRun: false
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: MAINNET_PRIVATE_KEYS,
          providerOrUrl: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
          numberOfAddresses: 3,
          derivationPath: "m/44'/60'/0'/0"
        });
      },
      network_id: 1,
      gasPrice: web3.utils.toWei("20", "gwei"),
      skipDryRun: false
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: ROPSTEN_PRIVATE_KEYS,
          providerOrUrl: "https://ropsten.infura.io/v3/" + INFURA_PROJECT_ID,
          numberOfAddresses: 3,
          derivationPath: "m/44'/60'/0'/0"
        });
      },
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: RINKEBY_PRIVATE_KEYS,
          providerOrUrl: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
          numberOfAddresses: 3,
          derivationPath: "m/44'/60'/0'/0"
        });
      },
      network_id: 4,
      skipDryRun: false
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: KOVAN_PRIVATE_KEYS,
          providerOrUrl: "https://kovan.infura.io/v3/" + INFURA_PROJECT_ID,
          addressIndex: 0,
          numberOfAddresses: 3
        });
      },
      network_id: 42,
      skipDryRun: false
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: GOERLI_PRIVATE_KEYS,
          providerOrUrl: "https://goerli.infura.io/v3/" + INFURA_PROJECT_ID,
          addressIndex: 0,
          numberOfAddresses: 3
        });
      },
      network_id: 5,
      gasPrice: web3.utils.toWei("2", "gwei"),
      skipDryRun: false
    },
    loc_development_development: {
      network_id: "*",
      port: 8546,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.6.2",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1337
        }
      }
    }
  },
  plugins: ['truffle-flatten']
};
