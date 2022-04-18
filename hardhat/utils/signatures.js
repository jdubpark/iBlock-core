const { BigNumberish } = require('ethers')
const {
  keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack,
} = require('ethers/lib/utils')
const { ecsign } = require('ethereumjs-util')

/**
 * @interface PermitApproveRequest
 * @property {string} owner
 * @property {string} spender
 * @property {BigNumber} amount
 */

/**
 *
 * @param {any} digest
 * @param {any} privateKey
 * @return {ECDSASignature}
 */
const sign = (digest, privateKey) => ecsign(Buffer.from(digest.slice(2), 'hex'), privateKey)

const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'),
)

/**
 * Returns the EIP712 domain separator
 * @param {string} name
 * @param {string} contractAddress
 * @param {number} chainId
 * @return {string}
 *
 * Refer to https://eips.ethereum.org/EIPS/eip-2612#specification
 */
function getDomainSeparator(name, contractAddress, chainId) {
  return keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256(toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes('1')),
        chainId,
        contractAddress,
      ],
    ),
  )
}

/**
 * Returns the EIP712 hash which should be signed by the user in order to make a call to `permit`
 * @param {string} name
 * @param {string} address
 * @param {number} chainId
 * @param {{owner:string,spender:string,value:BigNumberish}} approve
 * @param {BigNumberish} nonce
 * @param {BigNumberish} deadline
 * @return {string}
 */
function getPermitDigest(
  name,
  address,
  chainId,
  approve,
  nonce,
  deadline,
) {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, address, chainId)
  return keccak256(
    solidityPack(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline],
          ),
        ),
      ],
    ),
  )
}

module.exports = {
  sign, PERMIT_TYPEHASH, getDomainSeparator, getPermitDigest,
}
