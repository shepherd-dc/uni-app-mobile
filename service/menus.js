import { db } from '@/utils/request'

export async function getMenusList () {
	let res = {}
	uni.showLoading()
	try {
		const { result } = await db.collection('menus')
			.where({ status: 0 })
			.field({
				icon: 1,
				name: 1,
				en_name: 1,
				_id: 1,
				sup_id: 1
			})
			.orderBy('sort', 'desc')
			.get()
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
