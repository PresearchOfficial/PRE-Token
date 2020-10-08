
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const PREToken = artifacts.require('PREToken');
//const PREToken = artifacts.require('PREToken');

module.exports = async function (deployer) {
  const existing = await PREToken.deployed();
  const instance = await upgradeProxy(existing.address, PREToken, 
    { deployer,  initializer: "initialize", unsafeAllowCustomTypes: true  });
  console.log("Upgraded", instance.address);
};
