
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const PREToken = artifacts.require('PREToken');

module.exports = async function (deployer) {
  const instance = await deployProxy(
    PREToken, 
    ["PRE", "Presearch"], 
    { deployer,  initializer: "initialize", unsafeAllowCustomTypes: true }); 
      //unsafeAllowCustomTypes Ignores struct mapping in AccessControl, which is fine because it's used in a mapping
      //See: https://solidity.readthedocs.io/en/v0.6.2/miscellaneous.html#mappings-and-dynamic-arrays
  console.log('Deployed', instance.address);
};