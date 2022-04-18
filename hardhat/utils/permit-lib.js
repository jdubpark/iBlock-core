// Modified from https://github.com/dmihal/eth-permit/blob/master/src/lib.ts
// eslint-disable-next-line node/no-unpublished-require
const utf8 = require('utf8')

/**
 * Converts hex string to UTF8
 * @param {string} hex
 * @return {*}
 */
const hexToUtf8 = (hex) => {
  // if (!isHexStrict(hex))
  //     throw new Error('The parameter "'+ hex +'" must be a valid HEX string.');

  let str = ''
  let code = 0
  hex = hex.replace(/^0x/i, '')

  // remove 00 padding from either side
  hex = hex.replace(/^(?:00)*/, '')
  hex = hex.split('').reverse().join('')
  hex = hex.replace(/^(?:00)*/, '')
  hex = hex.split('').reverse().join('')

  const l = hex.length

  for (let i = 0; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16)
    // if (code !== 0) {
    str += String.fromCharCode(code)
    // }
  }

  return utf8.decode(str)
}

module.exports = {
  hexToUtf8,
}
