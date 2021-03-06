import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

/**
 * 1515 is iBlock Core's chain id
 * 31337 is Hardhat local dev
 */

export const injectedConnector = new InjectedConnector({ supportedChainIds: [1337, 1515, 31337, 5777] })

export const networkConnector = new NetworkConnector({
  urls: { 5777: process.env.REACT_APP_GANACHE_URL },
  defaultChainId: 5777,
})

export const gnosisSafeConnector = new SafeAppConnector()

export const walletConnectConnector = new WalletConnectConnector({
  rpc: { 1: process.env.REACT_APP_GANACHE_URL },
  qrcode: true,
})
