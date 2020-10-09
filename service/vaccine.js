import { db, dbCmd } from '@/utils/request'

export async function getVaccineList (type) {
	const $ = dbCmd.aggregate
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
		        dbCmd.expr($.and([
								$.eq(['$age_id', '$$id'])
							])
		        )
		      )
					.match({ type })
			    .done(),
			  as: 'vaccine'
		  })
		  .sort({
		    month: 1
		  })
		  .end()
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
