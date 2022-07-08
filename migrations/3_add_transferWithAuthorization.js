
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const PREToken = artifacts.require('PREToken');
const PRETokenV2 = artifacts.require('PRETokenV2');

module.exports = async function (deployer) {
  const existing = await PREToken.deployed();
  const instance = await upgradeProxy(existing.address, PRETokenV2, { deployer});
  instance.initialize();
  console.log("Upgraded", instance.address);
};
