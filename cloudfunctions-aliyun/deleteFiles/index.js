'use strict';
const uniID = require('uni-id');

exports.main = async (event, context) => {
	if (!event.uniIdToken) {
		return {
			code: 403,
			msg: '缺少token'
		}
	}
	const payload = await uniID.checkToken(event.uniIdToken)
	if (payload && payload.code > 0) {
		return payload
	}
	
	const { fileList } = event
	try {
		if (fileList.length) {
			// 多文件删除, 循环调用API
			for (let i = 0; i < fileList.length; i++) {
				await uniCloud.deleteFile({
				  fileList: [fileList[i]]
				})
			}	
		}
	} catch (e) {
		return {
			code: 500,
			result: e
		}
	}
	
	return {
		code: 0,
		result: {
			message: 'ok'
		}
	}
};
