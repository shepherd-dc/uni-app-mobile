'use strict';
const db = uniCloud.database()
const _ = db.command
const NOTEADDGROWTHVALUE = 1000

// 云函数入口函数
/**
 * 发表笔记
 * @param {data} 要发表的笔记内容
 * {
 *    data:{
 *      content,   //文字内容
 *      images     //已上传到云存储的图片内容
 *    }
 *  }
 * @return {object} 结果 
 * { 
 *    data,    //bool 发表笔记成功或失败
 *    errMsg   //如果发表笔记失败，该字段包含具体错误信息
 * }
 */
exports.main = async (event, context) => {
	const {
		openid,
		content,
		images
	} = event

	var result = false
	var errMsg = 'ok'
	var errCode = 0

	//读取用户信息
	var user = (await db.collection('user')
		.where({
			//云函数是在服务端操作，对所有用户的数据都有操作权限
			//在云函数中查询用户数据，需要添加openid的查询条件
			openid: openid
		})
		.get()).data[0]
	//添加笔记
	const noteResult = await db.collection('user_note')
		.add({
			_openid: openid, //云函数添加数据不会自动插入openid，需要手动定义
			date: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime(),
			content: content,
			images: images,
			upvoteNum: 0
		})
	const noteId = noteResult.id
	
	console.log('------noteResult------', noteResult)
	//添加成长值记录
	await db.collection('user_growth_value')
		.add({
			_openid: openid, //云函数添加数据不会自动插入openid，需要手动定义
			date: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime(),
			changeGrowthValue: NOTEADDGROWTHVALUE,
			operation: "发表笔记",
			timestamp: '',
			orderId: '',
			noteId: noteId
		})
	var newGrowthValue = user.growthValue + NOTEADDGROWTHVALUE //新成长值
	//修改成长值
	var updateUserResult = await db.collection('user')
		.where({
			//云函数是在服务端操作，对所有用户的数据都有操作权限
			//在云函数中查询用户数据，需要添加openid的查询条件
			openid: openid
		})
		.update({
			growthValue: newGrowthValue
		})
	if (updateUserResult.updated == 1) {
		result = true

		//调用风控规则校验
		await uniCloud.callFunction({
			name: 'growthValueRiskControl',
			data: {
				openid
			}
		})
	} else {
		errCode = 500
		errMsg = "系统异常，如有疑问请联系客服"
	}
	return {
		code: errCode,
		msg: errMsg,
		data: {
			result
		}
	}
}
