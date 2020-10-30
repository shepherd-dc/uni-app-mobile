<template>
  <view class="menus-container">
    <scroll-view :scroll-x="true">
      <view
        :class="{wrap: wrap}"
        class="menus">
        <view
          v-for="menu in menus"
          :key="menu._id"
          :class="{wrap: wrap}"
          class="menu-item"
          @tap="toMenuItem(menu)" >
          <image
            :src="menu.icon"
            class="menu-icon" />
          <text class="menu-text">{{ menu.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    wrap: {
      type: Boolean,
      default: true
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
			flex-wrap: nowrap;
			&.wrap {
				flex-wrap: wrap;
			}
		}
		.menu-item {
			padding-right: 20rpx;
			display: flex;
			flex-direction: column;
			justify-items: center;
			align-items: center;
			&.wrap {
				width: calc(~'25% - 20rpx');
				margin: 20rpx 10rpx;
			}
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
