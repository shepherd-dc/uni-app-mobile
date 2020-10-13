import { getDate } from '@/utils/datetime'
import { db, dbCmd } from '@/utils/request'
const $ = dbCmd.aggregate

/**
 * 添加自费疫苗
 */
export async function addVaccine (v) {
	let res = {}
	uni.showLoading()
	try {
		const { result } = await db.collection('user-vaccine').add({
			vaccine_id: v._id,
			vaccine_name: v.name,
			age_id: v.age_id,
			user_id: db.env.uid,
			added_time: Date.now()
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
 * 取消添加自费疫苗
 */
export async function cancelAddVaccine (id) {
	let res = {}
	uni.showLoading()
	try {
		const { result } = await db.collection('user-vaccine').where({
			vaccine_id: id,
			user_id: db.env.uid
		}).remove()
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
 * 完成疫苗
 */
export async function doVaccine (v) {
	let res = {}
	uni.showLoading()
	try {
		const { result } = await db.collection('vaccine-done').add({
			vaccine_id: v._id,
			vaccine_name: v.name,
			age_id: v.age_id,
			user_id: db.env.uid,
			done_time: v.done_time
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
 * 取消完成疫苗
 */
export async function undoVaccine (id) {
	let res = {}
	uni.showLoading()
	try {
		const { result } = await db.collection('vaccine-done').where({
			vaccine_id: id,
			user_id: db.env.uid
		}).remove()
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
 * 联表查询疫苗列表
 * @param {Object} type
 * type = 0 免费疫苗
 * type = 1 自费疫苗
 */
export async function getVaccineList (type) {
	let res = {}
	uni.showLoading()
	try {
		const { result } = await db.collection('ages').aggregate()
		  .lookup({
			  from: 'vaccine',
			  let: {
			    id: '$_id'
			  },
			  pipeline: $.pipeline()
			    .match(
						$.and([
							{ type },
							dbCmd.expr(
								$.eq(['$age_id', '$$id'])
							)
						])
					)
			    .done(),
			  as: 'vaccine'
		  })
		  .sort({
		    month: 1
		  })
		  .end()
		let addedList = [] // 用户已添加的自费列表
		let doneList = [] // 用户已完成的列表
		if (type === 0) {
			addedList = await getAddedList(0)
			doneList = await getDoneList()
		} else {
			addedList = await getAddedList(1)
		}
		for (let list of result.data) {
			// 遍历比对已添加列表
			for (let added of addedList) {
				if (list._id === added.age_id) {
					if (type === 0) { // 向默认免费列表中加入已添加的自费列表
						list.vaccine.push(added)
					} else if (type === 1) { // 将自费列表中用户已添加的标记为"已添加"
						list.vaccine.map(v => {
							if(v._id === added.vaccine_id) {
								v.added = 1
							}
						})
					}
				}
			}
			// 遍历比对已完成列表，将"默认免费+已添加自费"列表中用户已完成的标记为"已完成"
			if (type === 0 && doneList.length) {
				for (let done of doneList) {
					if (list._id === done.age_id) {
						list.vaccine.map(v => {
							if (v._id === done.vaccine_id) {
								v.done = 1
								v.done_time = getDate(done.done_time)
							}
						})
					}
				}
			}
		}
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
 * 查询用户已添加的自费列表
 * @param {Object} type
 * type = 0 联表查询
 * type = 1 不联表查询
 */
async function getAddedList (type) {
	let res = {}
	if (type === 0) {
		res = await aggregateAddedList()
	} else {
		res = await simpleAddedList()
	}
	return res
}

/**
 * 联表查询用户已添加的自费列表
 */
async function aggregateAddedList () {
	let res = {}
	try {
		const { result } = await db.collection('user-vaccine').aggregate()
			.match({
				user_id: db.env.uid
			})
			.lookup({
				from: 'vaccine',
				let: {
					vaccine_id: '$vaccine_id' // user-vaccine表中的疫苗id
				},
				pipeline: $.pipeline()
					.match(		
						dbCmd.expr(
							$.eq(['$_id', '$$vaccine_id'])
						)
					)
					.done(),
				as: 'vaccine'
			})
			.lookup({
				from: 'ages',
				let: {
					age_id: '$age_id' // user-vaccine表中的月龄id
				},
				pipeline: $.pipeline()
					.match(		
						dbCmd.expr(
							$.eq(['$_id', '$$age_id'])
						)
					)
					.done(),
				as: 'ages'
			})
			.sort({
				month: 1
			})
			.end()
		// 处理联表查询后的数据, 包含VaccineList中的所有字段
		res = handleLinkedData(result.data)
	} catch (e) {
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	}
	return res
}

/**
 * 不联表查询用户已添加的自费列表
 */
async function simpleAddedList () {
	let res = {}
	try {
		const { result } = await db.collection('user-vaccine')
			.where({
				user_id: db.env.uid
			})
			.get()
		res = result.data
	} catch (e) {
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	}
	return res
}

/**
 * 查询用户已完成的列表
 */
async function getDoneList () {
	let res = {}
	try {
		const { result } = await db.collection('vaccine-done')
			.where({
				user_id: db.env.uid
			})
			.get()
		res = result.data
	} catch (e) {
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	}
	return res
}

/**
 * 处理联表查询后的数据，将数组中的字段扁平展开至对象中
 */
function handleLinkedData (data) {
	return data.map(item => {
		if (item.vaccine.length) {
			for(let [k, v] of Object.entries(item.vaccine[0])){
				item[k] = v
			}
			Reflect.deleteProperty(item, 'vaccine') // eslint-disable-line
		}
		if (item.ages.length) {
			for(let [k, v] of Object.entries(item.ages[0])){
				if (['_id', 'sort', 'status'].includes(k)) continue;
				item[k] = v
			}
			Reflect.deleteProperty(item, 'ages') // eslint-disable-line
		}
		return item
	})
}
