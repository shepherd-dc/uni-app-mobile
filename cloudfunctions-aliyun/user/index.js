'use strict'; 
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir) 
 
exports.main = async (event, context) => {
	const { type } = event
	// 加载业务函数
	let controller
	try {
		controller = require(resolve(type))
	} catch (err) {
		return {
			code: 404,
			msg: '请求错误: Request not found',
		}
	}
	// 执行业务函数
	return await controller[type](event)
}
