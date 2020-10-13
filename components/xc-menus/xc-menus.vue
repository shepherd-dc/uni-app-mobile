<template>
  <view class="menus-container">
    <view class="menus">
      <view
        v-for="menu in menus"
        :key="menu._id"
        class="menu-item"
        @tap="toMenuItem(menu)" >
        <image
          :src="menu.icon"
          class="menu-icon" />
        <text class="menu-text">{{ menu.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      pathMap: []
    }
  },
  methods: {
    toMenuItem (item) {
			this.$emit('navigateTo', item)
    }
  }
}
</script>

<style lang="less" scoped>
	.menus-container {
		background-color: #fff;
		.menus {
			display: flex;
			flex-wrap: wrap;
		}
		.menu-item {
			width: calc(~'25% - 20rpx');
			box-sizing: border-box;
			margin: 20rpx 10rpx;
			// padding: 10rpx;
			// border: 1rpx solid #007AFF;
			display: flex;
			flex-direction: column;
			justify-items: center;
			align-items: center;
			.menu-icon {
				width: 120rpx;
				height: 120rpx;
				border-radius: 20rpx;
			}
			.menu-text {
				margin-top: 10rpx;
				font-size: 28rpx;
			}
		}
	}
</style>
