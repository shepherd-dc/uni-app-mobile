import { db, dbCmd } from '@/utils/request'
const $ = dbCmd.aggregate

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
		const addedList = await getAddedList()
		for (let list of result.data) {
			for (let added of addedList) {
				if (list._id === added.age_id) {
					// 向默认免费列表中加入已添加的自费列表
					if (type === 0) {
						list.vaccine.push(added)
					} else if (type === 1) {
						list.vaccine.map(v => {
							v.added = 1
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
 * 连表查询用户已添加的自费列表
 */
async function getAddedList () {
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
		// 处理连表查询后的数据, 包含VaccineList中的所有字段
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

function handleLinkedData (data) {
	return data.map(item => {
		for(let [k, v] of Object.entries(item.vaccine[0])){
			item[k] = v
		}
		Reflect.deleteProperty(item, 'vaccine') // eslint-disable-line
		for(let [k, v] of Object.entries(item.ages[0])){
			item[k] = v
		}
		Reflect.deleteProperty(item, 'ages') // eslint-disable-line
		return item
	})
}
