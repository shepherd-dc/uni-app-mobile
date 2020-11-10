<template>
  <view class="child-item">
    <view class="child-body">
      <view class="list-main">
        <view class="title">
          <view class="title-main">
            <text
              :class="typeClass"
              class="type">{{ data.typeText }}</text>
            <text class="name">{{ data.title }}</text>
          </view>
          <view class="title-extra">{{ data.extra }}</view>
        </view>
        <view
          v-if="data.description"
          class="description">
          <text>{{ data.description }}</text>
        </view>
        <view class="images">
          <slot name="images"></slot>
        </view>
      </view>
      <view class="list-extra">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    typeClass () {
      const map = {
        '2': 'red',
        '1': 'green',
        '-1': 'yellow'
      }
      const key = String(this.data.type)
      return map[key]
    }
  }
}
</script>

<style lang="less" scoped>
	.child-item {
		padding-bottom: 20rpx;
		border-top: 2rpx solid #f8f8f8;
	}
	.child-body {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;
	}
	.list-main {
		.title {
			display: flex;
			// justify-content: space-between;
			.type {
				background-color: #56ceab;
				border-radius: 20rpx;
				color: #fff;
				font-size: 26rpx;
				padding: 2rpx 20rpx;
				margin-right: 20rpx;
			}
			.type.red {
				background-color: #f7647e;
			}
			.type.yellow {
				background-color: #fab234;
			}
			.name {
				margin-right: 20rpx;
				color: #666;
			}
			.title-extra {
				color: #999;
			}
		}
		.description {
			color: #999;
			font-size: 30rpx;
			margin-top: 20rpx;
			text-align: justify;
		}
	}
	.list-extra {
		position: relative;
	}
</style>
