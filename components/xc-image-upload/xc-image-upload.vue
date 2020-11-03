<template>
  <view class="photos">
    <view
      v-for="(photo, index) in photos"
      :key="photo.tempFilePath"
      class="photo-item">
      <image
        :src="photo.tempFilePath"
        class="photo-image"
        mode="widthFix" />
      <view
        class="delete-image"
        @click="deleteImage(index)">
        <u-icon name="close"></u-icon>
      </view>
    </view>
    <view
      v-if="photos.length < 9"
      class="photo-icon"
      @click="takePhoto">
      <u-icon
        v-if="!photos.length"
        name="camera"></u-icon>
      <u-icon
        v-else
        name="plus"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      photos: []
    }
  },
  methods: {
    takePhoto () {
      uni.chooseMedia({
        count: 9,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          console.log('chooseMedia', res)
          const { tempFiles } = res
          if (this.photos.length <= 9 && (this.photos.length + tempFiles.length) <= 9) {
            this.photos = this.photos.concat(tempFiles)
            this.$emit('change', this.photos)
          } else {
            this.$toast('最多只能上传9张图片')
          }
        }
      })
    },
    deleteImage (index) {
      this.photos.splice(index, 1)
      this.$emit('change', this.photos)
    },
    clear () {
      this.photos = []
    }
  }
}
</script>

<style lang="less" scoped>
	.photos {
		display: flex;
		flex-wrap: wrap;
	}
	.photo-item {
		border-radius: 10rpx;
		width: 180rpx;
		height: 180rpx;
		overflow: hidden;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		.photo-image {
			width: 100%;
		}
		.delete-image {
			position: absolute;
			height: 36rpx;
			width: 36rpx;
			font-size: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			right: 0px;
			top: 0px;
			background-color: rgba(250, 53, 52, 0.5);
			color: #fff;
			z-index: 999;
			border-radius: 8rpx 10rpx 8rpx 8rpx;
		}
	}
	.photo-icon {
		width: 180rpx;
		height: 180rpx;
		border: 1px solid #cccccc;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
		color: #999;
		border-radius: 5px;
	}
</style>
