
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const PRETokenV2 = artifacts.require('PRETokenV2');
const PRETokenV3 = artifacts.require('PRETokenV3');

module.exports = async function (deployer) {
  const existing = await PRETokenV2.deployed();
  const instance = await upgradeProxy(existing.address, PRETokenV3, { deployer, timeout: 0 });
  instance.initialize();
  console.log("Upgraded", instance.address);
};
