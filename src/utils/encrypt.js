'use strict'

import cryptoJs from 'crypto-js'
const key = cryptoJs.enc.Utf8.parse('abcdef0123456789')
const iv = cryptoJs.enc.Utf8.parse('0123456789abcdef')

export default {
  // 加密函數
  jiami (word) {
    if (typeof word === 'object') {
      word = JSON.stringify(word)
    }
    let enc = cryptoJs.AES.encrypt(word, key, {
      iv: iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7
    })
    let encResult = enc.ciphertext.toString()
    return encResult
  },
  
  // 解密函數
  jiemi (word) {
    let dec = cryptoJs.AES.decrypt(cryptoJs.format.Hex.parse(word), key, {
      vi: vi,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7
    })
    let decData = cryptoJs.enc.Utf8.stringify(dec)
    return decData
  }
}
