
# PRE-Token
Presearch ERC-20 Token

## Overview
This is the source code for the PRE Token, which powers the Presearch platform at https://presearch.org.

The smart contract provides a secure and upgradeable token, which will ultimately enable fully decentralized governance over all utility of the token during phase III of the project. To learn more about Presearch, our plans, and the role of the PRE token, please see our Vision Paper:
https://presearch.io/vision.pdf

## Setup
1. run `npm install`
2. run `truffle compile`

## Generate PREToken Source Code for Verification
run `truffle-flattener contracts/PREToken.sol > build/source/PREToken.sol`

## Generate Proxy Source Code for Verification (Used for Upgrades)
run `truffle-flattener node_modules/@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol > build/source/AdminUpgradabilityProxy.sol && truffle-flattener node_modules/@openzeppelin/upgrades/contracts/upgradeability/ProxyAdmin.sol > build/source/ProxyAdmin.sol`

## Local Testing
1. run `truffle compile --all`
2. Start a local blockchain (such as Ganache) on port 8545
3. run `truffle migrate`

## Interacting with the Deployed Token
1. run `truffle console`
2. run `let pre = await PREToken.deployed()`
3. run any contract functions on the `pre` object:
    * `pre.transfer(addresses[1], 100)`
    * `pre.transferBatch([addresses[2],addresses[3]],[2000, 300000])`
    * `pre.totalSupply()`
    * ...