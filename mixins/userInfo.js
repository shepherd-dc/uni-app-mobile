import { loginCheck } from '@/utils/loginCheck'
import UserService from '@/service/UserService'
import LevelService from '@/service/LevelService'

export default {
	async onLoad() {
		const res = await loginCheck()
		if (res) this.uid = res.uid
		if (this.uid) {
			await this.getOpenid(this.uid)
			//获取用户信息
			this.setUserData()
		}
	},
	data() {
		return {
			uid: undefined,
			openid: undefined,
			myInfo: {},
			myLevel: {},
			discount: 0
		}
	},
	methods: {
		async getOpenid (uid) {
			const userService = new UserService()
			const res = await userService.getOpenid(uid)
			const userInfo = res.data[0]
			const openid = userInfo.wx_openid['mp-weixin']
			this.openid = openid
		},
		/**
		 * 获取并设置用户信息数据
		 */
		async setUserData () {
			const levelService = new LevelService()
			const levelList = await levelService.getLevelList()
			const levels = levelList.data
			
			const userService = new UserService()
			const userInfo = await userService.getUserInfo(this.openid)
			const myInfo = userInfo.data[0]
			const myLevel = levels.filter(e => e.minGrowthValue <= myInfo.growthValue && myInfo.growthValue <= e.maxGrowthValue)[0]
			this.myInfo = myInfo
			this.myLevel = myLevel
			//设置用户等级对应的折扣
			if (myLevel.bonus && myLevel.bonus.length == 3) {
				this.discount = myLevel.bonus[2].discount
			}
		}
	}
}
