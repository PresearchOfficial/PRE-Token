
const { admin } = require('@openzeppelin/truffle-upgrades');
const { networks } = require('../truffle-config');
 
module.exports = async function (deployer, network) { 
  // Don't change ProxyAdmin ownership for our test network
  if (networks.hasOwnProperty(network) && networks[network].hasOwnProperty("proxyAdminOwner")){
    const proxyAdminOwner = networks[network].proxyAdminOwner
    if (web3.utils.isAddress(proxyAdminOwner)){
      // The owner of the ProxyAdmin can upgrade the Presearch contracts
      await admin.transferProxyAdminOwnership(proxyAdminOwner);
      console.log("Upgraded Proxy Admin Owner to multisig wallet: " + proxyAdminOwner);
    }

  }
};