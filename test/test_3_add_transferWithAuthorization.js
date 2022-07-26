const { expect, assert } = require('chai');
const { deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');
 
// Load compiled artifacts
const PREToken = artifacts.require('PREToken');
const PRETokenV2 = artifacts.require('PRETokenV2');
 
// Start test block
contract('PRETokenV2 (proxy)', (accounts) => {
 
  beforeEach(async function () {
    // Deploy a new PRE contract for each test
    this.pre = await deployProxy(
        PREToken, 
        ["Presearch", "PRE"], 
        { initializer: "initialize", unsafeAllowCustomTypes: true }); 

  });

  async function upgradeToV2(pre){
    const preV2 = await upgradeProxy(pre.address, PRETokenV2, { timeout: 0, unsafeAllowCustomTypes: true });
    await preV2.initialize();
    return preV2;
  }

  function pre_num(num) { 
    return web3.utils.toWei(num.toString());
  }

  function toBN(num){
    return web3.utils.toBN(num);
  }


  it('Role is preserved after upgrade', async function () {
    const pre = this.pre;
    const PAUSER_ROLE = await pre.PAUSER_ROLE();
    
    expect((await pre.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(1));
    await pre.grantRole(PAUSER_ROLE, accounts[1]);
    console.log((await pre.getRoleMember(PAUSER_ROLE, 1)));
    console.log((await pre.getRoleMemberCount(PAUSER_ROLE)));
    expect((await pre.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(2));
    const preV2 = await upgradeToV2(pre);
    console.log((await pre.getRoleMemberCount(PAUSER_ROLE)));
    expect((await pre.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(2));
    await pre.grantRole(PAUSER_ROLE, accounts[2]);
    console.log((await pre.getRoleMemberCount(PAUSER_ROLE)));
    expect((await pre.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(3));
  });

  it('Test add to balance before and after upgrade', async function () {
    const pre = this.pre;
    expect((await pre.balanceOf(accounts[2]))).to.eql(toBN(0));
    expect((await pre.balanceOf(accounts[1]))).to.eql(toBN(0));
    await pre.transferBatch([accounts[2],accounts[1]],[pre_num(1000),pre_num(999998.9999)])
    expect((await pre.balanceOf(accounts[2]))).to.eql(toBN(pre_num(1000)));
    expect((await pre.balanceOf(accounts[1]))).to.eql(toBN(pre_num(999998.9999)));
    const preV2 = await upgradeToV2(pre);
    expect((await preV2.balanceOf(accounts[2]))).to.eql(toBN(pre_num(1000)));
    expect((await preV2.balanceOf(accounts[1]))).to.eql(toBN(pre_num(999998.9999)));
    await pre.transfer(accounts[1],pre_num(1.0001));
    expect((await preV2.balanceOf(accounts[2]))).to.eql(toBN(pre_num(1000)));
    expect((await preV2.balanceOf(accounts[1]))).to.eql(toBN(pre_num(1000000)));
  });

  it('Test address same after upgrade', async function () {
    expect((await upgradeToV2(this.pre)).address).to.eql(this.pre.address);
  });

  it('New Role works and doesn\'t conflict', async function () {
    const pre = this.pre;
    const PAUSER_ROLE = await pre.PAUSER_ROLE();

    expect((await pre.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(1)); //deployer
    expect(await pre.getRoleMember(PAUSER_ROLE, 0)).to.equal(accounts[0]);
    await pre.grantRole(PAUSER_ROLE, accounts[1]);
    expect((await pre.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(2));
    expect(await pre.getRoleMember(PAUSER_ROLE, 1)).to.equal(accounts[1]);
    
    const preV2 = await upgradeToV2(pre);
    const TRANSFER_AUTHORIZER_ROLE = await preV2.TRANSFER_AUTHORIZER_ROLE();

    expect((await preV2.getRoleMemberCount(TRANSFER_AUTHORIZER_ROLE))).to.eql(toBN(1)); //deployer
    await preV2.grantRole(TRANSFER_AUTHORIZER_ROLE, accounts[2]);
    expect((await pre.getRoleMemberCount(TRANSFER_AUTHORIZER_ROLE))).to.eql(toBN(2));
    expect(await pre.getRoleMember(PAUSER_ROLE, 0)).to.equal(accounts[0]);
    expect(await pre.getRoleMember(PAUSER_ROLE, 1)).to.equal(accounts[1]);
    expect(await pre.getRoleMember(TRANSFER_AUTHORIZER_ROLE, 1)).to.equal(accounts[2]);
  });

});