<template>
	<view class="auth-box">
		<view class="auth">
			<view class="logo">
				<image
					class="logo-image"
					src="../../static/img/logo.jpg"></image>
			</view>
			<view class="login">
				<button
					class="login-button"
					type="primary"
					open-type="getUserInfo"
					@getuserinfo="getUserInfo">微信授权登录</button>
				<button
					class="login-button nologin-button"
					type="default"
					@tap="cancelLogin">暂不登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import { loginByWeixin } from '@/api/auth'
	export default {
		data () {
			return {}
		},
		computed: mapState(['forcedLogin']),
		methods: {
			...mapMutations(['saveLoginState']),
			getWeixinCode() {
				return new Promise((resolve, reject) => {
					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail(err) {
							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},
			async getUserInfo ({ detail }) {
				console.log(detail)
				const code = await this.getWeixinCode()
				const res = await loginByWeixin({ code })
				console.log(res)
				const { token } = res
				this.saveLoginState({
					username: detail.userInfo.nickName,
					token
				})
				this.uniSetStorage(token)
				this.$toast('登陆成功')
				this.toMain()
			},
			uniSetStorage (token) {
				try {
				   uni.setStorageSync('sn-token', token);
				} catch (e) {
				  this.$toast(e)
				}
			},
			toMain (username, token) {
			  /**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
			  if (this.forcedLogin) {
			    uni.reLaunch({
			      url: '../main/main'
			    })
			  } else {
			    uni.navigateBack()
			  }
			},
			cancelLogin () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less" scoped>
	.auth-box {
		width: 100%;
		height: 100%;
	}
	.auth {
		margin-top: 50%;
		transform: translate(0, -50%);
	}
	.logo {
		display: flex;
		.logo-image {
			width: 300rpx;
			height: 300rpx;
			margin: 100rpx auto;
			border-radius: 16rpx;
		}		
	}
	.login {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 0 10rpx;
		.login-button{
		  border-radius: 100rpx;
		  width: calc(~"(100% - 40rpx)/2");
		  font-size: 32rpx;
		  color: white;
		}
		.nologin-button{
		  color: #666;
			background-color: #fff;
			border: 1px solid #bbb;
			margin-top: 40rpx;
		}
	}
</style>
