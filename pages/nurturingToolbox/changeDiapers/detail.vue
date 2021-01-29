<template>
  <view class="change-diapers-detail">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="changeDiapers"
    >
			<u-cell-group>
				<u-cell-item
					:arrow="false"
					:value-style="valueStyle"
					title="换尿布时间">{{ detail.startTime }}</u-cell-item>
				<u-cell-item
					:arrow="false"
					:value-style="{ textAlign: 'left', paddingLeft: '72rpx' }"
					title="嘘嘘颜色">{{ detail.peeColor }}</u-cell-item>
				<u-cell-item
					:arrow="false"
					:value-style="{ textAlign: 'left', paddingLeft: '72rpx' }"
					title="便便颜色">{{ detail.pooColor }}</u-cell-item>
				<u-cell-item
					:arrow="false"
					:value-style="{ textAlign: 'left', paddingLeft: '72rpx' }"
					title="便便质地">{{ detail.pooTexture }}</u-cell-item>
			</u-cell-group>
			<view class="note-container">
				<view class="label">随手记</view>
				<text class="note">{{ detail.note }}</text>
				<xc-media-upload
					v-if="detail.photos && detail.photos.length"
					:editable="false"
					:images="detail.photos" />
			</view>
		</detail-layout>
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord } from '@/service/toolbox'
import toolboxConfig from '@/config/toolbox'
const { changeDiapers: { collection } } = toolboxConfig

export default {
  components: {
    DetailLayout
  },
  mixins: [
    DetailMixin
  ],
  onShow () {
		 this.getRecord()
  },
  data () {
    return {
      detail: {},
      loading: true,
			valueStyle: {
				textAlign: 'left',
				paddingLeft: '40rpx'
			}
    }
  },
  methods: {
    async getRecord () {
      const result = await getRecord(collection, this.id)
      const { data } = result
      console.log('getRecord', data)
      if (data && data.length) {
        const detail = data[0]
        detail.typeText = '换尿布'
        detail.type = -1
        detail.title = detail.feedingTime
        detail.description = detail.note
        this.detail = detail
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
	.change-diapers-detail {
		width: 100%;
		position: relative;
	}
	.ingredients {
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #333;
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
