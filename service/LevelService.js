import { db, dbCmd as _ } from '@/utils/request'

/**
 * 用户等级规则数据操作类
 *@class LevelService
 *@constructor
 */
class LevelService {
  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 从数据库获取用户等级规则列表信息
   * @method getLevelList
   * @for LevelService
   * levelList示例数据：
   *  [{
   *      id: 2,
   *      title: "幼稚园",
   *      isSelect: false,
   *      minGrowthValue: 20000,
   *      maxGrowthValue: 49900,
   *      icon: "brown",
   *      bonus: [
   *          { name: "创作笔记", desc: ""
   *          },
   *          { name: "优享折扣", desc: "98折", discount: 0.98
   *          },
   *          { name: "会费立减", desc: "5千积分", discount: 5000
   *          }
   *        ]
   *   },]
   */
	async getLevelList () {
		let res = {}
		uni.showLoading()
		try {
			const { result } = await db.collection('user-level')
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

export default LevelService
