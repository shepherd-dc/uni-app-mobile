<template>
	<view class="user-level-growth" v-if="inited">
		<xc-level
			:myInfo="myInfo"
			:myLevel="myLevel"
			:nextLevel="nextLevel"
			:growthValueToNextLevel="growthValueToNextLevel" />
		
		<xc-growth
			:levels="levels"
			:selectedId="selectedId"
			:selectedLevel="selectedLevel"
			@on-item-click="onLevelItemClick" />	
		
		<view class="btn-row">
			<button type="default" @click="syncGrowthValue">同步微信运动数据 {{ stepInfoList.step || '' }}</button>
		</view>
		
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { loginCheck } from '@/utils/loginCheck'
	import LevelService from '@/service/LevelService'
	import UserService from '@/service/UserService'
	
	export default {
		onLoad () {
		  loginCheck()
		},
		onShow () {
			if (this.hasLogin) this.getLevelList()
		},
		onReady () {
			// //用户授权读取微信运动数据
			// this.authorizeWeRun()
		},
		data() {
			return {
				levels: [],
				myInfo: {},
				myLevel: {},
				selectedId: undefined,
				selectedLevel: undefined,
				growthValueToNextLevel: 0,
				nextLevel: undefined,
				stepInfoList: [],
				inited: false
			}
		},
		computed: {
		  ...mapState(['hasLogin', 'forcedLogin'])
		},
		methods: {
			syncGrowthValue () {
				//用户授权读取微信运动数据
				this.authorizeWeRun()
			},
			/**
			 * 用户授权读取微信运动数据
			 */
			authorizeWeRun () {
				const that = this
				// 首先获取用户的授权状态
				// uni.getSetting的说明详见
				// https://uniapp.dcloud.net.cn/api/other/authorize
				// https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSetting.html
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.werun']) {
							// 如果用户还未授权过，需要用户授权读取微信运动数据
							// uni.authorize详见
							// https://uniapp.dcloud.net.cn/api/other/authorize
							// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
							uni.authorize({
								scope: 'scope.werun',
								success() {
									that.getWeRunData()
								},
								fail() {
									//如果用户拒绝授权，提示用户需要同意授权才能获取他的微信运动数据
									uni.showModal({
										title: '读取微信运动数据失败',
										content: '请在小程序设置界面（「右上角」 - 「关于」 - 「右上角」 - 「设置」）中允许我们访问微信运动数据',
									})
								}
							})
						} else {
							//如果用户已授权过，直接开始同步微信运动数据
							that.getWeRunData()
						}
					}
				})
			},
			/**
			 * 获取微信运动数据
			 */
			getWeRunData () {
				const that = this
				// 调用微信运动API获取用户最近30天的运动步数，详见https://developers.weixin.qq.com/miniprogram/dev/api/wx.getWeRunData.html
				wx.getWeRunData({
					success(weRunEncryptedData) {
						// 调用云函数，获得解密后的微信运动步数
						that.getStepInfoList(weRunEncryptedData)
					}
				})
			},
			/**
			 * 调用云函数，获取解密后的微信运动步数
			 */
			async getStepInfoList (weRunEncryptedData) {
				const { encryptedData, iv } = weRunEncryptedData
				const jscode = await this.getTempCode()
				//云调用获取解密后的开放数据
				uniCloud.callFunction({
					name: 'weRunData',
					data: {
						js_code: jscode,
						encryptedData,
						iv
					},
					success: (res) => {
						console.log('weRunData', res.result.stepInfoList[res.result.stepInfoList.length - 1])
						//保存调用云函数得到的解密后微信运动步数，用于显示
						this.stepInfoList = res.result.stepInfoList[res.result.stepInfoList.length - 1]
					},
				})
			},
			getTempCode (value = 'weixin') {
				return new Promise((reslove, reject) => {
					uni.login({
						provider: value,
						success: (res) => {
							reslove(res.code)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			async getOpenid () {
				const jscode = await this.getTempCode()
				const { data } = await this.$uniCloud('loginByWechat', {
				  js_code: jscode
				})
				return data.openid
			},
			async getLevelList () {
				const levelService = new LevelService()
				const levelList = await levelService.getLevelList()
				console.log('getLevelList', levelList)
				const levels = levelList.data
				
				const openid = await this.getOpenid()
				const userService = new UserService()
				const userInfo = await userService.getUserInfo(openid)
				console.log('getUserInfo', userInfo)
				const myInfo = userInfo.data[0]
				this.setLevelData(levels, myInfo)
			},
			setLevelData (levels, myInfo) {
				const myLevel = levels.filter(e => e.minGrowthValue <= myInfo.growthValue && myInfo.growthValue <= e.maxGrowthValue )[0]
				this.levels = levels
				this.myLevel = myLevel
				this.myInfo = myInfo
				this.selectedId = myLevel.id
				this.selectedLevel = levels[myLevel.id - 1]
				
				const nextLevel = levels.filter(e => e.id == myLevel.id + 1)[0]
				if (nextLevel !== undefined) {
					this.growthValueToNextLevel = nextLevel.minGrowthValue - myInfo.growthValue,
					this.nextLevel = nextLevel
				}
				//显示界面
				this.inited = true
			},
			onLevelItemClick (id) {
				//如果切换成长等级才响应
				if (this.selectedId != id) {
					this.selectedId = id
					this.selectedLevel = this.levels[id - 1]
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.user-level-growth {
		padding: 0 30rpx;
	}
	.btn-row {
		margin-top: 40rpx;
	}
</style>
