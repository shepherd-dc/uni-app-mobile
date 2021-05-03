<template>
  <view class="content">
    <view
      v-show="!hasLogin"
      class="userinfo">
      <view
        class="userinfo-media"
        @tap="bindLogin">
        <img
          class="avatar"
          src="@/static/img/avatar.png"/>
        <span class="name">游客</span>
      </view>
      <view class="btn-row">
        <button
          type="primary"
          class="primary"
          @tap="bindLogin">登录</button>
      </view>
    </view>
    <view
      v-if="hasLogin"
      class="userinfo">
      <view class="userinfo-media">
        <open-data
          class="avatar"
          type="userAvatarUrl"></open-data>
        <open-data
          class="name"
          type="userNickName"></open-data>
      </view>
      <view class="btn-row">
        <button
          type="default"
          @tap="bindLogout">退出登录</button>
      </view>
    </view>
		<view class="btn-row">
			<button type="default" @click="test">账号登录测试</button>
		</view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'

export default {
  onLoad () {
    loginCheck()
  },
	onReady () {
		//用户授权读取微信运动数据
		this.authorizeWeRun()
	},
	data() {
		return {
			stepInfoList: []
		}
	},
  computed: {
    ...mapState(['hasLogin', 'forcedLogin'])
  },
  methods: {
    ...mapActions(['logout']),
    bindLogin () {
      uni.navigateTo({
        url: '../user/auth'
      })
    },
    bindLogout () {
      this.logout()
      // 如果需要强制登录跳转回登录页面
      if (this.forcedLogin) {
        uni.reLaunch({
          url: '../user/auth'
        })
      }
    },
		test () {
			uni.navigateTo({
			  url: '../user/login'
			})
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
					console.log('weRunData', res.result)
					//保存调用云函数得到的解密后微信运动步数，用于显示
					this.stepInfoList = res.result
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
		}
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  text-align: center;
  &-media {
    background-color: #fff;
    padding: 50rpx 40rpx;
    display: flex;
    align-items: center;
    position: relative;
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 100%;
      margin-right: 35rpx;
    }
    .name {
      font-size: 32rpx;
    }
  }
}
</style>
