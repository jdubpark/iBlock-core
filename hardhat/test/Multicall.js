// enable this line if linting gives error

const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('MultiCall', async () => {
  let wallets
  let multiCall

  before('Get wallets', async () => {
    wallets = await ethers.getSigners()
  })

  beforeEach('Create multicall', async () => {
    const multiCallTestFactory = await ethers.getContractFactory('TestMultiCall')
    multiCall = (await multiCallTestFactory.deploy())
  })

  it('Revert messages are returned', async () => {
    await expect(
      multiCall.multicall([multiCall.interface.encodeFunctionData('functionThatRevertsWithError', ['abcdef'])]),
    ).to.be.revertedWith('abcdef')
  })

  it('Return data is properly encoded', async () => {
    const [data] = await multiCall.callStatic.multicall([
      multiCall.interface.encodeFunctionData('functionThatReturnsTuple', ['1', '2']),
    ])
    const {
      tuple: { a, b },
    } = multiCall.interface.decodeFunctionResult('functionThatReturnsTuple', data)
    expect(b).to.eq(1)
    expect(a).to.eq(2)
  })

  describe('Context is preserved', () => {
    it('msg.value', async () => {
      await multiCall.multicall([multiCall.interface.encodeFunctionData('pays')], { value: 3 })
      expect(await multiCall.paid()).to.eq(3)
    })

    it('msg.value used twice', async () => {
      await multiCall.multicall(
        [multiCall.interface.encodeFunctionData('pays'), multiCall.interface.encodeFunctionData('pays')],
        { value: 3 },
      )
      expect(await multiCall.paid()).to.eq(6)
    })

    it('msg.sender', async () => {
      expect(await multiCall.returnSender()).to.eq(wallets[0].address)
    })
  })
})
