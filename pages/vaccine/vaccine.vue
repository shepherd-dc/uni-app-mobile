<template>
	<view class="vaccine">
		<view class="header">
			<view class="add" @tap="toAdd">
				<uni-icons type="plusempty" size="16"></uni-icons>
				<text>添加自费</text>
			</view>
			<view class="tip">
				<text>接种须知</text>
			</view>
		</view>
		<view class="body">
			<xc-list :list="list"></xc-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		async mounted () {
			const db = this.$db
			const dbCmd = db.command
			const $ = dbCmd.aggregate
			const { result } = await db.collection('ages').aggregate()
			.lookup({
			  from: 'vaccine',
			  let: {
			    id: '$_id'
			  },
			  pipeline: $.pipeline()
			    .match(
						dbCmd.expr(
							$.eq(['$age_id', '$$id'])
						)
					)
			    .done(),
			  as: 'vaccine',
			})
			.sort({
				month: 1
			})
			.end()
			console.log(result)
			this.list = result.data
		},
		methods: {
			toAdd () {
				this.$navigateTo('/vaccine/add')
			}
		}
	}
</script>

<style lang="less" scoped>
.vaccine {
	height: 100%;
	width: 100%;
	background-color: #f8f8f8;
}
.header {
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	padding: 20rpx;
	border-bottom: 8rpx solid #f8f8f8;
	.tip {
		color: #56ceab;
	}
}
.body {
}
</style>
