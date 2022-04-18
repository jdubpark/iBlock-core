// NOTE: mocha & ethers is available automatically

const { expectRevert } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const { ethers } = require('hardhat') // enable this line if linting gives error

const {
  TOKEN_NAME, TOKEN_SYMBOL, TOKEN_INITIAL_SUPPLY, TOKEN_VERSION, HARDHAT_CHAIN_ID,
} = require('../utils/constants')
const {
  PERMIT_TYPEHASH, getPermitDigest, getDomainSeparator, sign,
} = require('../utils/signatures')

const { BigNumber } = ethers

// priv key of the first address (without 0x
const OWNER_PRIVATE_KEY = Buffer.from('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'hex')

const fakeSig = {
  v: BigNumber.from('27'),
  r: '0x0000000000000000000000000000000000000000000000000000000000000001',
  s: '0x0000000000000000000000000000000000000000000000000000000000000002',
}

describe('ERC20Permit (EIP-2612)', () => {
  let TokenFactory
  let token
  let owner
  let spender
  let addrs

  before('Get wallets', async () => {
    [owner, spender, ...addrs] = await ethers.getSigners()
  })

  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    TokenFactory = await ethers.getContractFactory('SampleToken')

    // To deploy our contract, we just have to call Token.deploy() and await for it to be
    // deployed(), which happens once its transaction has been mined.
    token = await TokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_INITIAL_SUPPLY) // { from: owner }
  })

  it('Initializes DOMAIN_SEPARATOR correctly', async () => {
    expect(await token.DOMAIN_SEPARATOR()).to.equal(getDomainSeparator(TOKEN_NAME, token.address, HARDHAT_CHAIN_ID))
    // expect(await token._PERMIT_TYPEHASH).to.equal(PERMIT_TYPEHASH)
  })

  it('Permits and emits Approval (replay safe)', async () => {
    // Create the approval request
    const approve = {
      owner: owner.address, // pass in the address
      spender: spender.address,
      value: 100,
    }
    const deadline = 100000000000000 // deadline as much as you want in the future
    const nonce = await token.nonces(owner.address) // Get the user's nonce

    // Get the EIP712 digest
    const digest = getPermitDigest(TOKEN_NAME, token.address, HARDHAT_CHAIN_ID, approve, nonce, deadline)

    // Sign it
    // NOTE: Using web3.eth.sign will hash the message internally again which
    // we do not want, so we're manually signing here
    const { v, r, s } = sign(digest, OWNER_PRIVATE_KEY)

    // Approve it
    const receipt = await token.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s)
    console.log(receipt)

    // It worked!
    expect(receipt).to.emit(token, 'Approval')
    expect(await token.nonces(owner.address)).to.equal(1)
    expect(await token.allowance(approve.owner, approve.spender)).to.equal(approve.value)

    // Re-using the same sig doesn't work since the nonce has been incremented
    // on the contract level for replay-protection
    await expectRevert(
      token.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s),
      'ERC20Permit: invalid signature',
    )

    // Invalid ecrecover's return address(0x0), so we must also guarantee that this case fails
    await expectRevert(
      token.permit(
        '0x0000000000000000000000000000000000000000',
        approve.spender,
        approve.value,
        deadline,
        '0x99',
        r,
        s,
      ),
      // 'ERC20Permit: invalid signature',
      'ECDSA: invalid signature \'v\' value',
    )
  })

  it('Permits & Executes Transaction', () => {

  })
})
