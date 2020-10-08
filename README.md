# PRE-Token
Presearch ERC-20 Token

## Overview
This is the source code for the PRE Token, which powers the Presearch platform at https://presearch.org.

The smart contract provides a secure and upgradeable token, which will ultimately enable fully decentralized governance over all utility of the token during phase III of the project. To learn more about Presearch, our plans, and the role of the PRE token, please see our Vision Paper:
https://presearch.io/vision.pdf

## Setup:
1. run `npm install`
2. run `truffle build`
3. Start a local blockchain (recommend Ganache) on port 8545
4. run `truffle migrate`

## Generate Flattened PREToken Contract:
run `truffle run flatten contracts/PREToken.sol && mv flatten/Flattened.sol flatten/PREToken.sol`

## Generate Flattened Proxy Contracts:
run 
`truffle run flatten node_modules/@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol && mv flatten/Flattened.sol flatten/AdminUpgradabilityProxy.sol`

`truffle run flatten node_modules/@openzeppelin/upgrades/contracts/upgradeability/ProxyAdmin.sol && mv flatten/Flattened.sol flatten/ProxyAdmin.sol`


## Interacting:
To interact with your contract on the command line:
1. run `truffle console`
2. run `let pre = await PREToken.deployed()`
3. run any contract functions on the `pre` object:
- pre.transfer(addresses[1], 100)
- pre.transferBatch([addresses[2],addresses[3]],[2000, 300000])
- pre.totalSupply()
- ...

## IDE and Debugging
TODO

## Tests
TODO

## Deploying to other Networks
TODO

## Token Swap Details
TODO
