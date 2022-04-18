// Modified from https://github.com/dmihal/eth-permit/blob/master/src/eth-permit.ts

const { getChainId, call, signData } = require('./permit-rpc')
const { hexToUtf8 } = require('./permit-lib')

const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

/**
 * @interface ERC2612PermitMessage
 * @property {string} owner
 * @property {string} spender
 * @property {number|string} value
 * @property {number|string} nonce
 * @property {number|string} deadline
 */
/**
 * @interface Domain
 * @property {string} name
 * @property {string} version
 * @property {number} chainId
 * @property {string} verifyingContract
 */
/**
 * @interface RSV
 * @property {string} r
 * @property {string} s
 * @property {number} v
 */

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

/**
 * @param {ERC2612PermitMessage} message
 * @param {Domain} domain
 * @return {{types: {Permit: [{name: string, type: string}, {name: string, type: string}, {name: string, type: string}, {name: string, type: string}, {name: string, type: string}], EIP712Domain: [{name: string, type: string}, {name: string, type: string}, {name: string, type: string}, {name: string, type: string}]}, primaryType: string, domain: Domain, message: ERC2612PermitMessage}}
 */
const createTypedERC2612Data = (message, domain) => ({
  types: {
    EIP712Domain,
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  },
  primaryType: 'Permit',
  domain,
  message,
})

const NONCES_FN = '0x7ecebe00'
const NAME_FN = '0x06fdde03'

/**
 * @param {number} numZeros
 * @return {string}
 */
const zeros = (numZeros) => ''.padEnd(numZeros, '0')

/**
 * @param {any} provider
 * @param {string} address
 * @return {Promise<*>}
 */
const getTokenName = async (provider, address) => hexToUtf8((await call(provider, address, NAME_FN)).substr(130))

/**
 * @param {any} provider
 * @param {string|Domain} token
 * @return {Promise<Domain>}
 */
const getDomain = async (provider, token) => {
  if (typeof token !== 'string') return token

  const tokenAddress = token

  const [name, chainId] = await Promise.all([
    getTokenName(provider, tokenAddress),
    getChainId(provider),
  ])

  return {
    name, version: '1', chainId, verifyingContract: tokenAddress,
  } // domain
}

/**
 *
 * @param {any} provider
 * @param {string|Domain} token
 * @param {string} owner
 * @param {string} spender
 * @param {string|number=MAX_INT} value
 * @param {number} [deadline]
 * @param {number} [nonce]
 * @return {Promise<ERC2612PermitMessage & RSV>}
 */
const signERC2612Permit = async (
  provider,
  token,
  owner,
  spender,
  value,
  deadline,
  nonce,
) => {
  const tokenAddress = token.verifyingContract || token

  // ERC2612PermitMessage
  const message = {
    owner,
    spender,
    value,
    nonce: nonce || await call(provider, tokenAddress, `${NONCES_FN}${zeros(24)}${owner.substr(2)}`),
    deadline: deadline || MAX_INT,
  }

  const domain = await getDomain(provider, token)
  const typedData = createTypedERC2612Data(message, domain)
  const sig = await signData(provider, owner, typedData)

  return { ...sig, ...message }
}

module.exports = {
  signERC2612Permit,
}
