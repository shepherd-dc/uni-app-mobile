<template>
	<view class="membership-pay">
		<view class="privilege-container">
			<view class="title">
				会员特权：
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
		</view>
		<u-card title="开通服务" sub-title="VIP会员卡">
			<view slot="body">
				<scroll-view :scroll-x="true">
					<view class="plans-container">
						<view 
							class="plan"
							:class="plan.id === selectedId ? 'active' : ''"
							v-for="(plan, index) in membershipPlans"
							:key="plan.id"
							@click="onPlanItemClick(plan.id, index)"
						>
							<view class="title">{{plan.title}}</view>
							<view class="price-line-through">
								p{{plan.listPrice}}
							</view>
							<view class="price">
								P{{plan.price}}
							</view>
							<view>相当于</view>
							<view class="per-month">
								p{{plan.price/plan.validity}}/月
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-card>
		<view class="pay-info">
			<u-cell-group>
				<u-cell-item :arrow="false" icon="setting-fill" title="用户等级" :value="'购买会员省p' + discount" :value-style="valueStyle"></u-cell-item>
				<u-cell-item :arrow="false" icon="integral-fill" title="支付方式" value="积分支付" :value-style="valueStyle"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="pay-btn">
			<u-button @click="onPayButtonClick" type="error" :custom-style="{'background-color': '#f7647e'}">
				立即支付 P{{price - discount}}
			</u-button>
		</view>

		<u-modal v-model="showPaySuccess" @confirm="confirm" confirm-color="#f7647e" title="温馨提示" :title-style="{color: '#f7647e'}">
			<view class="slot-content">
				<view>支付成功</view>
				<view>您已成功开通VIP会员卡</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import userInfoMixin from '@/mixins/userInfo'
	import MembershipService from '@/service/MembershipService'
	export default {
		async onLoad() {
			//获取小M卡会员套餐信息
			this.getMembershipPlans()
		},
		mixins: [
			userInfoMixin
		],
		data() {
			return {
				valueStyle: {"text-align": "left", "margin-left": "20px", "color": "#000"},
				membershipPlans: [],
				selectedId: 1,
				price: 0,
				showPaySuccess: false,
				showPayFaild: false
			}
		},
		methods: {
			async getMembershipPlans () {
				const membershipService = new MembershipService()
				const membershipPlans = await membershipService.getMembershipPlans()
				this.membershipPlans = membershipPlans.data
				// 设置用户默认选中的套餐为第一个套餐
				this.selectedId = this.membershipPlans[0].id
				this.price = this.membershipPlans[0].price
			},
			onPlanItemClick (id, index) {
				this.selectedId = id
				this.price = this.membershipPlans[index].price
			},
			/**
			 * 购买会员套餐按钮点击事件
			 */
			onPayButtonClick () {
				if (this.myInfo.point < this.price - this.discount) {  
					//如果用户的当前可用积分不够购买套餐，提示用户无法购买，不需要调用支付接口
					uni.showModal({
						content: '抱歉你的积分不足，无法购买',
						showCancel: false,
					})
				} else {
					//支付操作，需要弹出确认支付窗口进行二次确认
					uni.showModal({
						title: '积分支付',
						content: '你即将支付p' + (this.price - this.discount).toString(),
						confirmText: "确认",
						cancelText: "取消",
						success: (res) => {
							//用户确认支付
							if (res.confirm) {
								//在调用云函数执行支付逻辑时，需要在页面中提示用户正在支付中
								uni.showLoading({
									title: '支付中...',
								})
								//调用支付接口进行支付
								this.pay()
							}
						}
					});
				}
			},
			/**
			 * 调用支付接口进行支付
			 */
			pay () {
				//调用云函数执行支付逻辑
				uniCloud.callFunction({
					name: 'payMembership',
					data: {
						openid: this.openid,
						membershipPlanId: this.selectedId
					},
					success: (res) => {
						const { result } = res
						//根据云函数返回值，决定显示支付成功、支付失败或其他提示
						if (result.code === 0) {
							const { data } = result
							if (data.result === true) {
								this.showPaySuccess = true
							}
						} else if (result.code === 400500) {
							uni.showModal({
								content: '很抱歉，你的积分不足，无法购买',
								showCancel: false,
							})
						} else {
							this.showPayFaild = true
							uni.showModal({
								content: result.msg,
								showCancel: false,
							})
						}
					},
					fail: (err) => {
						//调用云函数失败，显示支付失败提示界面
						console.error(err)
						this.showPayFaild = true
					},
					complete: () => {
						//云函数返回支付结果后取消正在支付中的提示
						uni.hideLoading(); 
					}
				})
			},
			confirm () {
				uni.navigateTo({
					url: '/pages/mine/card'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.membership-pay {
		width: 100%;
		// display: flex;
		// flex: 1;
		// flex-direction: column;
		background-color: #efeff4;
		padding: 30rpx 0;
	}
	.flex-column {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 28rpx;
		text-align: center;
	}
	.privilege-container {
		background-color: #fff;
		margin-bottom: 30rpx;
		padding: 30rpx;
		margin: 0 30rpx;
		border-radius: 10rpx;
	}
	.privilege {
		padding-top: 30rpx;
		display: flex;
		justify-content: space-around;
		.rights {
			width: 130rpx;
			height: 130rpx;
			border: 4rpx $mk-contrast-color solid;
			border-radius: 50%;
			margin-bottom: 10rpx;
			line-height: 120rpx;
			color: $mk-contrast-color;
			font-size: 40rpx;
		}
	}
	.pay-info {
		margin: 0 30rpx;
	}
	.plans-container {
		background-color: #fff;
		display: flex;
		.plan {
			min-width: 190rpx;
			border: 2rpx solid #eee;
			border-radius: 10rpx;
			padding: 30rpx 0;
			margin: 0 10rpx;
			text-align: center;
			&.active {
				border: 2rpx solid $mk-contrast-color;
				color: $mk-contrast-color;
			}
			.title {
				font-size: 30rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			.price {
				font-size: 38rpx;
				font-weight: bold;
				color: $mk-contrast-color;
				margin: 8rpx 0;
			}
			.price-line-through {
				text-decoration: line-through;
				font-size: 30rpx;
			}
		}
	}
	.pay-btn {
		margin: 30rpx 30rpx 0;
	}
	.slot-content {
		text-align: center;
		color: #666;
		line-height: 60rpx;
		margin: 30rpx 0;
	}
</style>
