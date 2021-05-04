'use strict';
// 云函数入口文件
const { wx } = require('config')
const WXBizDataCrypt = require('./WXBizDataCrypt')

// 云函数入口函数
/**
 * 解密微信小程序敏感数据
 * 需要用npm安装crypto和request
 * @param {data} 需要解密的数据
 * {
 *    data:{
 *      js_code,
 *      encryptedData,
 *      iv
 *    }
 *  }
 * @return {object} 解密后的数据
 */
exports.main = async (event, context) => {
  const { result } = await uniCloud.callFunction({
  	name: 'loginByWechat',
		data: {
			js_code: event.js_code
		}
  })
  const session = result.data;
  const sessionKey = session.session_key;
	const openid = session.openid
	const appid = wx.appId
	const encryptedData = event.encryptedData;
	const iv = event.iv;

  console.log("sessionKey-->" + sessionKey + "\r\n")
  console.log("appid-->" + appid + "\r\n")
  console.log("encryptedData-->" + encryptedData + "\r\n")
  console.log("iv-->" + iv + "\r\n")

  const pc = new WXBizDataCrypt(appid, sessionKey);
  const data = pc.decryptData(encryptedData, iv);
	data.openid = openid
  return data;
}
