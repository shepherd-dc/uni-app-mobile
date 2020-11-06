<template>
	<view class="breastfeeding-detail">
		<view class="record">
			<u-cell-group>
				<u-cell-item title="喂奶乳房" :arrow="false" :value-style="valueStyle">{{ detail.breast }}</u-cell-item>
				<u-cell-item title="开始时间" :arrow="false" :value-style="valueStyle">{{ detail.startTime }}</u-cell-item>
				<u-cell-item title="结束时间" :arrow="false" :value-style="valueStyle">{{ detail.endTime }}</u-cell-item>
				<u-cell-item title="持续时间" :arrow="false" :value-style="valueStyle">{{ detail.duration }}</u-cell-item>
			</u-cell-group>
			<view class="note-container">
				<view class="label">随手记</view>
				<text class="note">{{ test }}</text>
				<xc-media-preview ref="previewMedia" v-if="showPhotos" :images="detail.photos" @delete="handleDelete" />
			</view>
			<button type="default" @click="deleteAll">删除所有图片</button>
		</view>
	</view>
</template>

<script>
import { getRecord } from '@/service/toolbox-breastfeeding'
import { deleteFiles } from '@/utils/upload'
export default {
	onLoad (query) {
		this.id = query.params
	},
	onShow () {
		this.getRecord()
	},
	data () {
		return {
			id: '',
			detail: {},
			valueStyle: {
				textAlign: 'left',
				paddingLeft: '40rpx'
			},
			test: `uni-clientDB 2.0.0版本不兼容旧版，如果你依然需要使用旧版本请在此链接下载 uni-clientDB 1.0.8
clientDB框架的目标：减少服务端代码开发。
如今的应用，不管是App、小程序、H5，均是前后端分离。
前端是轻不下去了，但后端有机会越来越轻。
serveless减少了服务器的运维工作量，能不能再进一步，减少服务器的开发工作量？
答案是肯定的。`,
			loading: true
		}
	},
	computed: {
		showPhotos () {
			return this.detail.photos && this.detail.photos.length
		}
	},
	methods: {
		async getRecord () {
			const result = await getRecord(this.id)
			const { data } = result
			if (data.length) {
				this.detail = data[0]
			}
			console.log('getRecord', result)
		},
		handleDelete (index, item) {
			console.log(index, item)
			uni.showModal({
				title: '提示',
			  content: '确定删除吗?',
			  success: res => {
			    if (res.confirm) {
			      this.doDelete(index, item)
			    } else if (res.cancel) {

			    }
			  }
			})
		},
		async doDelete (index, item) {
			const res = await deleteFiles([item])
			if (res.code === 0) {
				this.detail.photos.splice(index, 1)
				uni.showToast({
				  title: '删除成功！',
				  icon: 'none'
				})
			} else {
				uni.showToast({
				  title: '删除失败！',
				  icon: 'none'
				})
			}
		},
		async deleteAll () {
			const res = await deleteFiles(this.detail.photos)
			if (res.code === 0) {
				this.detail.photos = []
				uni.showToast({
				  title: '删除成功！',
				  icon: 'none'
				})
			} else {
				uni.showToast({
				  title: '删除失败！',
				  icon: 'none'
				})
			}
		}
	}
}

</script>

<style lang="less" scoped>
	.breastfeeding-detail {
		width: 100%;
	}
	.note-container {
		padding: 30rpx;
		font-size: 28rpx;
	}
	.label {
		color: #606266;
		margin-bottom: 20rpx;
	}
	.note {
		color: #909399;
		line-height: 2;
	}
</style>
