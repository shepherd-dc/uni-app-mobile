import { db, dbCmd } from '@/utils/request'
const $ = dbCmd.aggregate

/**
 * 添加宝宝信息
 */
export async function addBabyInfo (data) {
	let res = {}
	uni.showLoading()
	try {
		data.user_id = db.env.uid
		data.create_time = Date.now()
		const { result } = await db.collection('user-baby').add(data)
		res = result
	} catch (e) {
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
 * 查询宝宝信息
 */
export async function getBabyInfo () {
	let res = {}
	try {
		const { result } = await db.collection('user-baby')
			.where({
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
