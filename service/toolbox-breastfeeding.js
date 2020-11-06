import { db, dbCmd } from '@/utils/request'
const $ = dbCmd.aggregate
const collection = db.collection('toolbox-breastfeeding')

/**
 * 添加记录
 */
export async function addRecord (data) {
	let res = {}
	uni.showLoading({
		title: '记录保存中',
		mask: true
	})
	try {
		const { result } = await collection.add({
			...data,
			user_id: db.env.uid,
			create_time: Date.now()
		})
		res = result
	} catch (e) {
		//TODO handle the exception
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	} finally {
	  uni.hideLoading()
	}
	return res
}

/**
 * 查询记录
 */
export async function getRecord (id) {
	let res = {}
	try {
		const { result } = await collection
			.where({
				_id: id,
				user_id: db.env.uid
			})
			.get()
		res = result
	} catch (e) {
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	}
	return res
}
