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
				@click="previewImage(index)" />
      <view
        class="delete-image"
        @click="deleteImage(index)">
        <u-icon name="close"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
	props: {
		images: {
			type: Array,
			default: () => []
		},
	},
  data () {
    return {
      photos: this.images
    }
  },
	watch: {
		images(newValue) {
			if (newValue) this.photos = newValue
		}
	},
  methods: {
    deleteImage (index) {
      this.$emit('delete', index, this.photos[index])
    },
		previewImage (i) {
			// 预览图片
			uni.previewImage({
				urls: this.photos,
			  current: i,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
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
		border-radius: 10rpx;
		width: 180rpx;
		height: 180rpx;
		overflow: hidden;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
		.photo-image {
			width: 100%;
			height: 100%;
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
