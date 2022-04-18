require('dotenv').config()

require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
require('solidity-coverage')

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

/**
 * === NOTE ===
 *  For anything localhost, make sure to run `npx hardhat node` on another terminal (leave it open)
 * === DEPLOY ===
 *  localhost: npx hardhat run scripts/deploy.js
 *  iblock (devchain): npx hardhat run scripts/deploy.js --network iblock
 */

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.6',
  defaultNetwork: 'localhost', // instead of 'hardhat', mimics '--network localhost' // MAKE SURE TO RUN `npx hardhat node` on another terminal
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    iblock: {
      accounts: [process.env.IBLOCK_PRIVATE_KEY],
      url: 'https://devchain.iblockcore.com',
    },
    iblock_prod: {
      accounts: [process.env.IBLOCK_PROD_PRIVATE_KEY],
      url: 'https://chain.iblockcore.com',
      // Combat `Error: cannot estimate gas; transaction may fail or may require manual gas limit`
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      allowUnlimitedContractSize: false,
      url: 'http://127.0.0.1:8545',
      // chainID 31337
    },
    ropsten: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: process.env.ROPSTEN_URL || '',
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}
