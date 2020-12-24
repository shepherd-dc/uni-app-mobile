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
      <!-- <u-cell-group>
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
      </u-cell-group> -->
      <!-- <view class="note-container">
        <view class="label">随手记</view>
        <text class="note">{{ detail.note }}</text>
        <xc-media-upload
          v-if="showPhotos"
          :editable="false"
          :images="detail.photos" />
      </view> -->
      <xc-list-body :body="detail">
        <template v-slot:images>
          <xc-media-upload
            :images="detail.photos"
            :editable="false" />
        </template>
      </xc-list-body>
      <view
        v-if="hasLogin && hasPermission"
        class="button-group">
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
import { mapState } from 'vuex'
import { getRecord, deleteRecord } from '@/service/toolbox-breastfeeding'
import { deleteFiles } from '@/utils/upload'
import { checkToken } from '@/service/auth'

export default {
  onLoad (opt) {
    console.log(opt)
	  this.id = opt.params
    // 设置 shareTicket
    uni.showShareMenu({
		  withShareTicket: true
    })
  },
  // 设置 发送给朋友
  onShareAppMessage (res) {
	  // 用户点击分享卡片后可获取的query参数
	  return {
	    title: '母乳亲喂记录',
	    path: `pages/nurturingToolbox/breastfeeding/detail?params=${this.id}`
	  }
  },
  // 设置 分享到朋友圈
  onShareTimeline (res) {
	  return {
		  title: '母乳亲喂记录',
		  query: `params=${this.id}`,
      imageUrl: '/static/img/logo.jpg'
	  }
  },
  async onShow () {
    await this.getRecord()
		if (this.hasLogin) {
			const token = await checkToken({uniIdToken: this.token})
			const { data: { uid } } = token
			this.uid = uid
		}
  },
  data () {
    return {
      id: '',
			uid: '',
      detail: {},
      valueStyle: {
        textAlign: 'left',
        paddingLeft: '40rpx'
      },
      loading: true
    }
  },
  computed: {
    ...mapState(['hasLogin', 'token']),
    showPhotos () {
      return this.detail.photos && this.detail.photos.length
    },
		hasPermission () {
			return this.detail.user_id === this.uid
		}
  },
  methods: {
    async getRecord () {
      const result = await getRecord(this.id)
      const { data } = result
      console.log('getRecord', data)
      if (data && data.length) {
        const detail = data[0]
        detail.typeText = detail.breast.substring(0, 2)
        detail.title = `${detail.startTime}~${detail.endTime.split(' ')[1]}`
        detail.extra = detail.duration
        detail.description = detail.note
        this.detail = detail
      }
      this.loading = false
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
      const fileList = this.detail.photos
      const res = await deleteFiles(fileList)
      console.log('deleteFiles', res)
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
		position: relative;
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
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
		padding: 0 30rpx;
	}
	.loading {
		text-align: center;
		width: 100%;
		height: 100%;
		padding-top: 100rpx;
	}
	.record {
		padding: 0 30rpx;
	}
</style>
