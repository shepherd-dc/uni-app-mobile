<template>
	<view class="switch-tab">
		<text class="active">全部</text>
		<text>免费</text>
		<text>自费</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less" scoped>
	.switch-tab {
		border: 1px solid #0FAEFF;
		border-radius: 40rpx;
		overflow: hidden;
		text {
			padding: 0 40rpx;
			border-right: 1px solid #0FAEFF;
			&:last-child {
				border-right: none;
			}
		}
		.active {
			color: #fff;
			background-color: #0FAEFF;
		}
	}
</style>
