'use strict';
const { wx } = require('config')

exports.main = async (event, context) => {
  // 获取openid 请求地址
	const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
	// uniCloud.httpclient 发起请求
	const result = await uniCloud.httpclient.request(apiUrl, {
		method: 'GET',
		dataType: 'json',
		data: { 
			'appid': wx.appId,
			'secret': wx.appSecret,
			'js_code': event.js_code, // wx.login 拿到的code
			'grant_type': 'authorization_code'
		} 
	});
	
	//返回数据给客户端
	return result.res;
};
