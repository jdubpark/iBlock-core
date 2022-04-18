// Modified from https://github.com/dmihal/eth-permit/blob/master/src/rpc.ts

const randomId = () => Math.floor(Math.random() * 10000000000)

/**
 * @param {any} provider
 * @param {string} method
 * @param {any[]} [params]
 * @returns {Promise<any>}
 */
const send = (provider, method, params) => new Promise((resolve, reject) => {
  const payload = {
    id: randomId(),
    method,
    params,
  }

  const callback = (err, result) => {
    if (err) {
      reject(err)
    } else if (result.error) {
      console.error(result.error)
      reject(result.error)
    } else {
      resolve(result.result)
    }
  }

  const _provider = provider.provider?.provider || provider.provider || provider

  if (_provider.getUncheckedSigner) { // ethers provider
    _provider
      .send(method, params)
      .then(resolve)
      .catch(reject)
  } else if (_provider.sendAsync) {
    _provider.sendAsync(payload, callback)
  } else {
    _provider
      .send(payload, callback)
      .catch(((error) => {
        if (
          error.message
          === "Hardhat Network doesn't support JSON-RPC params sent as an object"
        ) {
          _provider
            .send(method, params)
            .then(resolve)
            .catch(reject)
        } else {
          throw error
        }
      }))
  }
})

/**
 * @interface RSV
 * @property {string} r
 * @property {string} s
 * @property {number} v
 */

/**
 * @param {string} signature
 * @returns {RSV}
 */
const splitSignatureToRSV = (signature) => {
  const r = `0x${signature.substring(2).substring(0, 64)}`
  const s = `0x${signature.substring(2).substring(64, 128)}`
  const v = parseInt(signature.substring(2).substring(128, 130), 16)
  return { r, s, v }
}

/**
 * @param {any} signer
 * @param {string} fromAddress
 * @param {any} typeData
 * @returns {Promise<RSV>}
 */
const signWithEthers = async (signer, fromAddress, typeData) => {
  const signerAddress = await signer.getAddress()
  if (signerAddress.toLowerCase() !== fromAddress.toLowerCase()) {
    throw new Error('Signer address does not match requested signing address')
  }

  const { EIP712Domain: _unused, ...types } = typeData.types
  const rawSignature = await (signer.signTypedData
    ? signer.signTypedData(typeData.domain, types, typeData.message)
    : signer._signTypedData(typeData.domain, types, typeData.message))

  return splitSignatureToRSV(rawSignature)
}

/**
 * @param {any} provider
 * @param {string} fromAddress
 * @param {any} typeData
 * @returns {Promise<RSV>}
 */
const signData = async (provider, fromAddress, typeData) => {
  if (provider._signTypedData || provider.signTypedData) {
    return signWithEthers(provider, fromAddress, typeData)
  }

  const typeDataString = typeof typeData === 'string' ? typeData : JSON.stringify(typeData)
  const result = await send(provider, 'eth_signTypedData_v4', [fromAddress, typeDataString])
    .catch((error) => {
      if (error.message === 'Method eth_signTypedData_v4 not supported.') {
        return send(provider, 'eth_signTypedData', [fromAddress, typeData])
      }
      throw error
    })

  return {
    r: result.slice(0, 66),
    s: `0x${result.slice(66, 130)}`,
    v: parseInt(result.slice(130, 132), 16),
  }
}

let chainIdOverride
let number

/**
 * @param {number} id
 */
const setChainIdOverride = (id) => { chainIdOverride = id }

/**
 * @param {any} provider
 * @returns {Promise<any>}
 */
const getChainId = async (provider) => chainIdOverride || send(provider, 'eth_chainId')

/**
 * @param {any} provider
 * @param {string} to
 * @param {string} data
 * @returns {Promise<any>>}
 */
const call = (provider, to, data) => send(provider, 'eth_call', [{
  to,
  data,
}, 'latest'])

module.exports = {
  send, signData, setChainIdOverride, getChainId, call,
}
