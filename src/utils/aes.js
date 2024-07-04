import * as CryptoJS from 'crypto-js';
import { requestMethodGet } from "../api/api";
// import { JSEncrypt } from 'jsencrypt'
const {JSEncrypt} = require('encryptlong')
// const key = CryptoJS.enc.Utf8.parse('0123456789ASDFGH'); //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('ASDFGH0123456789'); //十六位十六进制数作为密钥偏移量 
let key = ''
let iv = ''
// 获取秘钥
requestMethodGet("/web/common/getPublicKey", {}).then(res => {
  if (res.data.code == 1000) {
    if(res.data.data){
      const str = res.data.data
      let newStr = ""
      for (let i = str.length - 1; i >= 0; i--) {
        newStr += str.charAt(i);
      }
      key = CryptoJS.enc.Utf8.parse(str)
      iv = CryptoJS.enc.Utf8.parse(newStr)
    }
  }
 }).catch(err=>{})
// 导出加密方法
export function Encrypt(word) {
  const src = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(src, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}

// 导出解密方法
export function Decrypt(word) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const src = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(src, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
/**
 * desc:rsa加密
 * **/
export function rsaEncryptUserId(data){
  if(typeof data == 'number') data = data.toString()
  // 新建JESencrypt对象
  const encryptor = new JSEncrypt();
  //   设置公钥
  encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpk5OIhGX4UyShECFEHikwC2K57JvAMSKNtsGIIjgF1luyMixtBOTH9kQYk8zb5a+DmY9jY/pFRkWCk0QhQVE2fEu2Zp7dqBy/zc7xD6vaq/dshZHyl8PE5JUiDcRQmuEi9+Edm4tp0r4T4C3d8oxMTPVSTYHHioDJcP2c8fD6sQIDAQAB')
  return encryptor.encryptLong(data);
}
