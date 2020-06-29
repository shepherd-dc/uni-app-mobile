'use strict';
exports.main = async (event, context) => {
  // 获取openid 请求地址
	const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
	// uniCloud.httpclient 发起请求
	const result = await uniCloud.httpclient.request(apiUrl, {
		method: 'GET',
		dataType: 'json',
		data: { 
			'grant_type': 'authorization_code',
			'appid': 'wxdce48ac0a8a7357d', //你自己小程序的appid
			'secret': '622e68e655ac2fcfdd8be92c9dd32dbb', // 在小程序管理平台 -> 开发 -> 开发设置中
			'js_code': event.js_code // wx.login 拿到的code
		} 
	});
	
	//返回数据给客户端
	return result.res;
};
