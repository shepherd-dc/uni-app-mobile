<template>
  <view class="photos">
    <view
      v-for="(photo, index) in photos"
      :key="photo"
      class="photo-item">
      <image
        :src="photo"
        class="photo-image"
        mode="aspectFill"
        @click.stop="previewImage(index)" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      photos: this.images
    }
  },
  watch: {
    images (newValue) {
      if (newValue) this.photos = newValue
    }
  },
  methods: {
    previewImage (i) {
      // 预览图片
      uni.previewImage({
        urls: this.photos,
			  current: i,
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function (data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
          },
          fail: function (err) {
            console.log(err.errMsg)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
	.photos {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}
	.photo-item {
		border-radius: 4rpx;
		width: 180rpx;
		height: 180rpx;
		overflow: hidden;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		position: relative;
		.photo-image {
			width: 100%;
			height: 100%;
		}
	}
</style>
