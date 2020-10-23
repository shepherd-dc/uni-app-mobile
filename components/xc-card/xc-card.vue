<template>
	<view class="card-item">
		<view class="card-header">
			<slot name="header">
				<view class="header-item header-icon"></view>
				<text class="header-item header-title">{{ title }}</text>
				<text class="header-item header-extra">{{ extra }}</text>
			</slot>
		</view>
		
		<view class="card-body">
			<view class="body-main">
				<slot>
					<view v-if="content">
						<text>{{ content }}</text>
					</view>
				</slot>
			</view>
		</view>
			
		<view
			v-if="tips"
			class="card-footer">
			<slot name="footer">
				<text>{{ tips }}</text>
			</slot>
		</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '标题'
			},
			extra: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: ''
			},
			tips: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="less" scoped>
.card-item {
	background-color: #fff;
	padding: 20rpx 20rpx 0;
	margin-bottom: 8rpx;
}
.card-header {
	display: flex;
	padding-bottom: 10rpx;
	border-bottom: 2rpx solid #f8f8f8;
	color: #333;
	.header-item {
		margin-right: 20rpx;
	}
	.header-icon {
		width: 8rpx;
		height: 40rpx;
		background-color: #56ceab;
	}
	.header-extra {
		color: #666;
	}
}
.card-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	line-height: 2;
}
.body-main {
	color: #333;
	font-size: 30rpx;
	margin-bottom: 20rpx;
}
.card-footer {
	// color: #3CC51F;
	color: #666;
	font-size: 30rpx;
	padding-bottom: 20rpx;
}
</style>
