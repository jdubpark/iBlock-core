const fs = require('fs')
const hre = require('hardhat')
const { ethers } = require('hardhat') // enable this line if linting gives error (usually on non-Solidity-focused IDE)
const path = require('path')

const INITIAL_SUPPLY = 10e9
const MINT_AMOUNT = 10e3

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  // <=== Load all contract factories ===>
  const Admin = await hre.ethers.getContractFactory('Admin')
  const Faucet = await hre.ethers.getContractFactory('Faucet')
  const GiesCoin = await hre.ethers.getContractFactory('GiesCoin')
  const Greeter = await hre.ethers.getContractFactory('Greeter')
  // const MultiCall = await hre.ethers.getContractFactory('MultiCall')
  const NFT = await hre.ethers.getContractFactory('NFT')
  const NFTMarket = await hre.ethers.getContractFactory('NFTMarket')
  const SampleToken = await hre.ethers.getContractFactory('SampleToken')

  // <=== Deploy contracts (libraries are linked automatically) ===>

  // (0) Basic
  const admin = await Admin.deploy(deployer.address) // one initial admin (msg.sender == deployer.address)

  // (1) Tokens
  const ALMA = await SampleToken.deploy('Alma Coin', 'ALMA', INITIAL_SUPPLY)
  const UNI = await SampleToken.deploy('Union Coin', 'UNI', INITIAL_SUPPLY)
  const QUAD = await SampleToken.deploy('Quad Coin', 'QUAD', INITIAL_SUPPLY)
  const GCO = await GiesCoin.deploy(INITIAL_SUPPLY, deployer.address)

  // (2) Interactions
  const greeter = await Greeter.deploy('Hello from the very best, Disruption Lab!')
  const faucet = await Faucet.deploy(ALMA.address, MINT_AMOUNT)

  // (3) NFT
  const nftMarket = await NFTMarket.deploy(GCO.address)
  const nft = await NFT.deploy(nftMarket.address)

  // (4) Helpers
  // const multiCall = await MultiCall.deploy()

  // <=== Any additional deployment actions ===>
  await ALMA.setAsMinter(faucet.address)

  // <=== Actions after completing deployment ===>
  const deployedSCs = {
    admin, ALMA, UNI, QUAD, GCO, greeter, faucet, nft, nftMarket,
  }
  const addressBook = {}

  await Promise.all(Object.keys(deployedSCs).map((name) => {
    const sc = deployedSCs[name]
    addressBook[name.toUpperCase()] = sc.address
    return sc.deployed()
      .then(() => {
        console.log(`${name.toUpperCase()} deployed to: \t ${sc.address}`)
        Promise.resolve()
      })
  }))

  await fs.promises.writeFile(
    path.join(__dirname, `../build/contractAddresses.${hre.network.name}.json`),
    JSON.stringify(addressBook),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
