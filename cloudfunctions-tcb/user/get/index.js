'use strict';
const db = uniCloud.database()
const { getVersion, successCode, failCode } = require('validate')

exports.get = async (event, context) => {
  // 获取 user 表的集合对象
  const collection = db.collection('user')
  let user
	if (event.openid) {
		user = await collection.where({
			openid: event.openid
		}).get()
		if (!user.data.length) {
			// 没有就新增
			await collection.add({
				openid: event.openid
			})
		}
		return {
			code: successCode,
			msg: 'success'
		}
	} else {
		// 操作云数据库必须 等待，查找user表中 username 为 event.username同时password为event.password的对象
		user = await collection.where({
			username: event.username,
			password: event.password
		}).get()
		// 找到的个数
		if (user.data.length) {
			return {
				code: successCode,
				msg: 'success',
				data: {
					username: user.data[0].username,
					version: getVersion()
				}
			}
		} else {
			// 没有找到
			return {
				code: failCode,
				msg: '用户名或密码错误'
			}
		}
	}
}
