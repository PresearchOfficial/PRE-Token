# PRE Token
Presearch ERC-20 Token. Deployed on the Ethereum Mainnet at  
**Token Address**: [0xEC213F83defB583af3A000B1c0ada660b1902A0F](https://etherscan.io/token/0xEC213F83defB583af3A000B1c0ada660b1902A0F)

## Overview
This is the source code for the PRE Token, which powers the Presearch platform at https://presearch.org.

The smart contract provides a secure and upgradeable token, which will ultimately enable fully decentralized governance over all utility of the token during phase III of the project. To learn more about Presearch, our plans, and the role of the PRE token, please see our Vision Paper:
https://presearch.io/vision.pdf


## Audit
The PRE Token smart contract was audited by PeckShield from October 8 - 12, 2020 (based on commit 97d6946). PeckShield checked all aspects related to the ERC20 standard compatibility and other known ERC20 pitfalls/vulnerabilities, and no issues were found in these areas. Peckshield also examined other areas such as coding practices and business logic. Overall, PeckShield reported one (optional) informational recommendation and one additional (also optional) recommendation regarding compiler version settings. 

Presearch implemented both of the optional Peckshield recommendations on October 16, 2020 (commit 6e94b7f) prior to deploying the token smart contract on October 17, 2020 to the Ethereum Mainnet.

The final audit report reflecting the token deployment was completed on October 31, 2020 and can be found in the audit folder: [PRE Token Smart Contract Audit Report](audit/PRE%20Token%20Smart%20Contract%20Audit%20Report.pdf).

## Setup
1. run `npm install`
2. run `truffle compile`

## Generate PRE Token Source Code for Verification
run `truffle-flattener contracts/PRETokenV3.sol > 
build/source/PRETokenV3.sol`

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
