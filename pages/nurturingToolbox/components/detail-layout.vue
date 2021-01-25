<template>
  <view class="toolbox-detail">
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
      <xc-list-body :body="detail" />
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
import { checkToken } from '@/service/auth'
import { deleteFiles } from '@/utils/upload'

export default {
  props: {
    module: {
      type: String,
      default: undefined
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: true
    },
    delete: Function
  },
  data () {
    return {
      uid: undefined
    }
  },
  computed: {
	  ...mapState(['hasLogin', 'token']),
	  hasPermission () {
	    return this.detail.user_id === this.uid
	  }
  },
  async created () {
    if (this.hasLogin) {
      const token = await checkToken({ uniIdToken: this.token })
      const { data: { uid }} = token
      this.uid = uid
    }
  },
  methods: {
    editRecord () {
      this.$navigateTo(`/nurturingToolbox/${this.module}/add?params=${this.detail._id}`)
    },
    deleteRecord () {
      uni.showModal({
			  title: '提示',
			  content: '确定删除吗?',
			  success: async res => {
			    if (res.confirm) {
			      await this.deleteAllImages()
			      const res = await this.delete(this.detail._id)
			      console.log('deleteRecord', res)
            this.$navigateTo(`/nurturingToolbox/${this.module}/${this.module}`)
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
	.toolbox-detail {
		width: 100%;
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
