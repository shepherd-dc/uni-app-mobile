<template>
	<view class="community">
		<u-tabs
			class="community-tabs"
			:list="list"
			:is-scroll="false"
			:current="current"
			active-color="#56ceab"
			bar-width="200"
			@change="change">
		</u-tabs>
		<xc-waterfall v-if="current === 0" @on-click-item="handleItemClick"></xc-waterfall>
		<u-icon class="publish-note" name="plus-circle-fill" color="#56ceab" size="100" @click="toPublish"></u-icon>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{ name: '发现' },
					{ name: '收藏' },
					{ name: '我的' }
				],
				current: 0
			}
		},
		methods: {
			change(index) {
				this.current = index;
			},
			handleItemClick (item) {
				uni.navigateTo({
					url: '/pages/ugc/detail'
				})
			},
			toPublish () {
				uni.navigateTo({
					url: '/pages/ugc/ugc'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.community {
		padding-top: 80rpx;
		&-tabs {
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 98;
		}
	}
	.publish-note {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 99;
	}
</style>
