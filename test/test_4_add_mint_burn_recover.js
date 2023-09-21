const { expect, assert  } = require('chai');
const { deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const truffleAssert = require('truffle-assertions');
 
// Load compiled artifacts
const PREToken = artifacts.require('PREToken');
const PRETokenV2 = artifacts.require('PRETokenV2');
const PRETokenV3 = artifacts.require('PRETokenV3');
 
// Start test block
contract('PRETokenV3 (proxy)', (accounts) => {
 
  beforeEach(async function () {
    // Deploy a new PRE contract for each test   
    let pre = await deployProxy(
        PREToken, 
        ["Presearch", "PRE"], 
        { initializer: "initialize", unsafeAllowCustomTypes: true }); 

    this.preV2 = await upgradeToV2(pre);
  });

  async function upgradeToV2(pre){
    const preV2 = await upgradeProxy(pre.address, PRETokenV2, { timeout: 0 });
    await preV2.initialize();
    return preV2;
  }

  async function upgradeToV3(preV2){
    const preV3 = await upgradeProxy(preV2.address, PRETokenV3, { timeout: 0 });
    await preV3.initialize();
    return preV3;
  }

  function pre_num(num) { 
    return web3.utils.toWei(num.toString());
  }

  function toBN(num){
    return web3.utils.toBN(num);
  }

  it('Max Supply increases, Total Supply doesn\'t', async function () {
    const preV2 = this.preV2;

    expect((await preV2.totalSupply())).to.eql(toBN(pre_num(500000000)));
    const prev3 = await upgradeToV3(preV2);
    const MINTER_ROLE = await prev3.MINTER_ROLE();
    await prev3.grantRole(MINTER_ROLE, accounts[1]);
    expect(await prev3.totalSupply()).to.eql(toBN(pre_num(500000000)));  
    await prev3.mint(accounts[1],pre_num(250000000));
    expect(await prev3.totalSupply()).to.eql(toBN(pre_num(750000000)));  
    
    await truffleAssert.reverts(
      prev3.mint(accounts[1],pre_num(250000001)),
      "revert"
    );
    expect(await prev3.totalSupply()).to.eql(toBN(pre_num(750000000)));  
    
    await prev3.mint(accounts[1],pre_num(250000000)); //should succeed
    expect(await prev3.totalSupply()).to.eql(toBN(pre_num(1000000000)));  
    
    await prev3.burn(pre_num(400000000), {from: accounts[0]});
    await prev3.burn(pre_num(200000000), {from: accounts[1]});
    expect(await prev3.totalSupply()).to.eql(toBN(pre_num(400000000))); 

    await truffleAssert.reverts(
       prev3.burn(pre_num(510000000), {from: accounts[1]}),
       "burn amount exceeds balance"
    );
    
    await prev3.mint(accounts[1],pre_num(600000000));
    expect(await prev3.totalSupply()).to.eql(toBN(pre_num(1000000000)));  
    
    await truffleAssert.reverts(
      prev3.mint(accounts[1],pre_num(1)),
      "revert"
    );
  });

  it('MINTER_ROLE works', async function () {
    const preV2 = this.preV2;

    expect((await preV2.totalSupply())).to.eql(toBN(pre_num(500000000)));
    
    const prev3 = await upgradeToV3(preV2);
    const MINTER_ROLE = await prev3.MINTER_ROLE();

    expect((await prev3.getRoleMemberCount(MINTER_ROLE))).to.eql(toBN(1)); //deployer
    expect(await prev3.mint(accounts[0],pre_num(1))); //should succeed (deployer)
    expect((await prev3.totalSupply())).to.eql(toBN(pre_num(500000001)));
    expect(! await prev3.mint(accounts[1],pre_num(100))); //should fail (role not assigned)

    await prev3.grantRole(MINTER_ROLE, accounts[1]);
    await prev3.mint(accounts[1],pre_num(100)); //should succeed

    await prev3.revokeRole(MINTER_ROLE, accounts[1]);
    expect(! await prev3.mint(accounts[1],pre_num(100))); //should fail (role not assigned)

  });


  it('Role is preserved after upgrade', async function () {
    const preV2 = this.preV2;
    const PAUSER_ROLE = await preV2.PAUSER_ROLE();
    
    expect((await preV2.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(1));
    await preV2.grantRole(PAUSER_ROLE, accounts[1]);
    console.log((await preV2.getRoleMember(PAUSER_ROLE, 1)));
    console.log((await preV2.getRoleMemberCount(PAUSER_ROLE)));
    expect((await preV2.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(2));
    
    const preV3 = await upgradeToV3(preV2);
    console.log((await preV3.getRoleMemberCount(PAUSER_ROLE)));
    expect((await preV3.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(2));
    await preV3.grantRole(PAUSER_ROLE, accounts[2]);
    console.log((await preV3.getRoleMemberCount(PAUSER_ROLE)));
    expect((await preV3.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(3));
  });

  it('Test add to balance before and after upgrade', async function () {
    const preV2 = this.preV2;
    expect((await preV2.balanceOf(accounts[2]))).to.eql(toBN(0));
    expect((await preV2.balanceOf(accounts[1]))).to.eql(toBN(0));
    await preV2.transferBatch([accounts[2],accounts[1]],[pre_num(1000),pre_num(999998.9999)])
    expect((await preV2.balanceOf(accounts[2]))).to.eql(toBN(pre_num(1000)));
    expect((await preV2.balanceOf(accounts[1]))).to.eql(toBN(pre_num(999998.9999)));
    
    const preV3 = await upgradeToV3(preV2);
    expect((await preV3.balanceOf(accounts[2]))).to.eql(toBN(pre_num(1000)));
    expect((await preV3.balanceOf(accounts[1]))).to.eql(toBN(pre_num(999998.9999)));
    await preV3.transfer(accounts[1],pre_num(1.0001));
    expect((await preV3.balanceOf(accounts[2]))).to.eql(toBN(pre_num(1000)));
    expect((await preV3.balanceOf(accounts[1]))).to.eql(toBN(pre_num(1000000)));
  });

  it('Test address same after upgrade', async function () {
    expect((await upgradeToV3(this.preV2)).address).to.eql(this.preV2.address);
  });

  it('New Role works and doesn\'t conflict', async function () {
    const preV2 = this.preV2;
    const PAUSER_ROLE = await preV2.PAUSER_ROLE();

    expect((await preV2.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(1)); //deployer
    expect(await preV2.getRoleMember(PAUSER_ROLE, 0)).to.equal(accounts[0]);
    await preV2.grantRole(PAUSER_ROLE, accounts[1]);
    expect((await preV2.getRoleMemberCount(PAUSER_ROLE))).to.eql(toBN(2));
    expect(await preV2.getRoleMember(PAUSER_ROLE, 1)).to.equal(accounts[1]);
    
    const preV3 = await upgradeToV3(preV2);
    const MINTER_ROLE = await preV3.MINTER_ROLE();

    expect((await preV3.getRoleMemberCount(MINTER_ROLE))).to.eql(toBN(1)); //deployer
    await preV3.grantRole(MINTER_ROLE, accounts[1]);
    expect((await preV3.getRoleMemberCount(MINTER_ROLE))).to.eql(toBN(2));
    expect(await preV3.getRoleMember(MINTER_ROLE, 0)).to.equal(accounts[0]);
    expect(await preV3.getRoleMember(MINTER_ROLE, 1)).to.equal(accounts[1]);
  });

  it('Recover works', async function () {
    const preV2 = this.preV2;
    const preV3 = await upgradeToV3(preV2);
    await preV3.transfer(preV3.address,pre_num(10), {from: accounts[0]});

    expect((await preV3.totalSupply())).to.eql(toBN(pre_num(500000000)));
    await preV3.recover();
    expect((await preV3.totalSupply())).to.eql(toBN(pre_num(499999990)));
    expect((await preV3.balanceOf(preV3.address))).to.eql(toBN(pre_num(0)));

  });

});