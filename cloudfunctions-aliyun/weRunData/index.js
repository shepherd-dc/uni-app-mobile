'use strict';
/**
 * 获取微信运动数据
 * 调用云函数时，对传入的 data 参数，如果有顶层字段的值为通过 wx.cloud.CloudID 构造的 CloudID，
 * 则调用云函数时，这些字段的值会被替换为 cloudID 对应的开放数据
 * @param {data} 
 * {
 *    data:{
 *      weRunData, 
 *    }
 *  }
 * @return {array} 解密后的微信运动步数
 */
exports.main = async (event, context) => {
  const { result } = await uniCloud.callFunction({
  	name: 'decryptData',
		data: {
			js_code: event.js_code,
			encryptedData: event.encryptedData,
			iv: event.iv
		}
  })
	console.log('-----decryptData------', result.stepInfoList)
  return result.stepInfoList
}
