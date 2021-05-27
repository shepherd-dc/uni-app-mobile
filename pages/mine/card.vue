<template>
	<view class="membership-card">
		<view class="card-container">
			<view class="flex-column">
				<text class="name align-left">VIP会员卡</text>
				<view class="align-left">
					<view>亲爱的{{ isMembershipExpired ? ' ' : 'VIP会员 '}}
					<open-data type="userNickName"></open-data>
					</view>
					<text>{{isMembershipExpired ? ' 开通VIP会员立享特权 ' : '会员有效期至：' + memberExpDate}}</text>
				</view>
			</view>
			<view class="flex-column align-right">
				<text class="logo">M</text>
				<text @click="join">{{ isMembershipExpired ? ' 马上开通 >' : ''}}</text>
			</view>
		</view>
		<view class="privilege">
			<view class="flex-column">
				<view class="rights">7折</view>
				<text>尊享折扣</text>
			</view>
			<view class="flex-column">
				<view class="rights">2倍</view>
				<text>积分加速</text>
			</view>
		</view>
		<u-button @click="join" shape="circle" type="error" :custom-style="{'background-color': '#f7647e'}">
			{{ isMembershipExpired ? '加入会员，立享特权' : '我要续费'}}
		</u-button>
	</view>
</template>

<script>
	import userInfoMixin from '@/mixins/userInfo'
	import { getDate } from '@/utils/datetime'
	export default {
		mixins: [
			userInfoMixin
		],
		onShow() {
			// 获取用户信息, 见 mixin
			if (this.uid) this.setUserData()
		},
		data() {
			return {

			}
		},
		computed: {
			isMembershipExpired () {
				return this.myInfo.memberExpDate < new Date()
			},
			memberExpDate () {
				if (!this.myInfo.memberExpDate) return ''
				return getDate(this.myInfo.memberExpDate)
			}
		},
		methods: {
			join () {
				uni.navigateTo({
					url: '/pages/mine/pay'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.membership-card {
		margin: 0 auto;
		.card-container {
			background-color: $mk-contrast-color;
			width: 690rpx;
			height: 360rpx;
			margin: 30rpx 0;
			padding: 30rpx 40rpx;
			border-radius: 20rpx;
			color: #fff;
			display: flex;
			justify-content: space-between;
			.name {
				font-size: 40rpx;
			}
			.logo {
				font-size: 100rpx;
			}
			.align-right {
				text-align: right;
			}
			.align-left {
				text-align: left;
			}
		}
		.flex-column {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			font-size: 28rpx;
			text-align: center;
		}
		.privilege {
			margin-bottom: 30rpx;
			display: flex;
			justify-content: space-around;
			.rights {
				width: 160rpx;
				height: 160rpx;
				border: 4rpx $mk-contrast-color solid;
				border-radius: 50%;
				margin-bottom: 10rpx;
				line-height: 150rpx;
				color: $mk-contrast-color;
				font-size: 40rpx;
			}
		}
	}
</style>
