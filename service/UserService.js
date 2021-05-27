import { db, dbCmd as _ } from '@/utils/request'

/**
 *用户信息数据操作类
 *@class UserService
 *@constructor
 */
class UserService {
  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 从数据库获取用户信息
   * @method getUserInfo
   * @for UserService
   * userinfo数据结构：
   * {
   *    _id,
   *    _openid,
   *    date, //注册时间
   *    growthValue, //总成长值
   *    point, //可用积分
   *    memberExpDate,  //会员到期时间 Membership Expiration Date
   *    isLocked //是否因触发风控规则被锁定
   * }
   */
	async getUserInfo (openid) {
		let res = {}
		uni.showLoading()
		try {
			const { result } = await db.collection('user')
				.where({
					openid
				})
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
	
	async getOpenid (uid) {
		let res = {}
		uni.showLoading()
		try {
			const { result } = await db.collection('uni-id-users')
				.where({
					_id: uid
				})
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

export default UserService
