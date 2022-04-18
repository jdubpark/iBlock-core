const { expect } = require('chai')
const { ethers } = require('hardhat') // enable this line if linting gives error

const {
  TOKEN_NAME, TOKEN_SYMBOL, TOKEN_INITIAL_SUPPLY, MINT_AMOUNT,
} = require('../utils/constants')

const { keccak256, toUtf8Bytes } = ethers.utils

describe('Sample Faucet (ALMA)', () => {
  let TokenFactory
  let FaucetFactory
  let ALMA
  let Faucet
  let owner
  let addr1
  let addr2
  let addrs
  let decimals

  before('Get wallets', async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  })

  beforeEach(async () => {
    // Get the ContractFactory and Signers here.
    TokenFactory = await ethers.getContractFactory('SampleToken')
    FaucetFactory = await ethers.getContractFactory('Faucet')

    // To deploy our contract, we just have to call Token.deploy() and await for it to be
    // deployed(), which happens once its transaction has been mined.
    ALMA = await TokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_INITIAL_SUPPLY) // { from: owner }
    decimals = await ALMA.decimals()

    Faucet = await FaucetFactory.deploy(ALMA.address, MINT_AMOUNT)

    await ALMA.setAsMinter(Faucet.address)
  })

  /**
   * NOTE: use describe.only() to only run that particular test
   */

  describe('Deployment', () => {
    it('Set Faucet as the only other minter', async () => {
      const MINTER_ROLE = keccak256(toUtf8Bytes('MINTER_ROLE')) // convert utf8 to bytes first
      const minterCount = await ALMA.getRoleMemberCount(MINTER_ROLE)

      const minters = []
      for (let i = 0; i < minterCount; ++i) {
        minters.push(await ALMA.getRoleMember(MINTER_ROLE, i))
      }

      expect(minterCount).to.equal(2)
      expect(minters).to.deep.equal([await ALMA.owner(), Faucet.address]) // must do .deep.equal
    })
  })

  describe('Drips', () => {
    it('Drips and emit "Drip"', async () => {
      // Call .drip() on Faucet as addr1 (msg.sender == addr1.address)
      await expect(Faucet.connect(addr1).drip()).to.emit(Faucet, 'Drip')
      expect(await ALMA.balanceOf(addr1.address)).to.equal(MINT_AMOUNT * 10 ** decimals)
    })

    it('Maintains timeout for the same address', async () => {
      await Faucet.connect(addr1).drip()
      await expect(Faucet.connect(addr1).drip()).to.be.revertedWith('DRIP_COOLDOWN')
    })
  })
})
