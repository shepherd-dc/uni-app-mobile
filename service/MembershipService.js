import { db, dbCmd as _ } from '@/utils/request'

/**
 *付费会员操作类
 *@class MembershipService
 *@constructor
 */
class MembershipService {
  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 从数据库获取付费会员套餐类型信息
   * @method getMembershipPlans
   * @for MembershipService
   * @param {function} successCallback(payMembershipInfo) 处理数据查询结果的回调函数
   * payMembershipInfo示例数据：
   *   [{
   *    id: 1,
   *    title: "月卡会员",
   *    listPrice: 20000,
   *    price: 20000,
   *    validity: 1
   *   },]
   */
  async getMembershipPlans() {
		let res = {}
		uni.showLoading()
		try {
			const { result } = await db.collection('membership_plan')
				.orderBy('id', 'asc')
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
}

export default MembershipService
