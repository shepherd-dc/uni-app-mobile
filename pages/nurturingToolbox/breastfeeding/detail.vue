<template>
  <view class="breastfeeding-detail">
    <view
      v-if="loading"
      class="loading">
      <u-loading
        size="50"
        mode="circle"></u-loading>
    </view>
    <view
      v-else
      class="record">
      <u-cell-group>
        <u-cell-item
          :arrow="false"
          :value-style="valueStyle"
          title="喂奶乳房">{{ detail.breast }}</u-cell-item>
        <u-cell-item
          :arrow="false"
          :value-style="valueStyle"
          title="开始时间">{{ detail.startTime }}</u-cell-item>
        <u-cell-item
          :arrow="false"
          :value-style="valueStyle"
          title="结束时间">{{ detail.endTime }}</u-cell-item>
        <u-cell-item
          :arrow="false"
          :value-style="valueStyle"
          title="持续时间">{{ detail.duration }}</u-cell-item>
      </u-cell-group>
      <view class="note-container">
        <view class="label">随手记</view>
        <text class="note">{{ detail.note }}</text>
        <xc-media-upload
          v-if="showPhotos"
          ref="previewMedia"
          :editable="false"
          :images="detail.photos" />
      </view>
      <view class="button-group">
        <xc-button-group
          confirm-text="编 辑"
          reset-text="删 除"
          @confirm="editRecord"
          @reset="deleteRecord" />
      </view>
    </view>
  </view>
</template>

<script>
import { getRecord, deleteRecord } from '@/service/toolbox-breastfeeding'
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
        this.detail.photos = this.transformToObjectArray(this.detail.photos)
        this.loading = false
      }
      console.log('getRecord', result)
    },
    editRecord () {
      this.$navigateTo('/nurturingToolbox/breastfeeding/add?params=' + this.id)
    },
    deleteRecord () {
      uni.showModal({
			  title: '提示',
			  content: '确定删除吗?',
			  success: async res => {
			    if (res.confirm) {
			      await this.deleteAllImages()
			      const res = await deleteRecord(this.id)
			      console.log('deleteRecord', res)
            this.$navigateTo('/nurturingToolbox/breastfeeding/breastfeeding')
			    }
			  }
      })
    },
    async deleteAllImages () {
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
    },
    transformToObjectArray (array) {
      const objArr = []
      array.forEach(photo => {
			  objArr.push({ tempFilePath: photo })
      })
      return objArr
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
	.button-group {
		padding: 0 30rpx;
		// position: absolute;
		// width: 100%;
		// left: 0;
		// bottom: 0;
	}
	.loading {
		text-align: center;
		width: 100%;
		height: 100%;
		padding-top: 100rpx;
	}
</style>
