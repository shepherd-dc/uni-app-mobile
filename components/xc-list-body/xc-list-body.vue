<template>
  <view class="child-item">
    <view class="child-body">
      <view class="list-main">
        <view class="title">
          <view class="title-main">
            <text
							v-if="body.typeText"
              :class="typeClass"
              class="type">{{ body.typeText }}</text>
            <text class="name">{{ body.title }}</text>
          </view>
          <view class="title-extra">{{ body.extra }}</view>
        </view>
        <view
          v-if="body.description"
          class="description">
          <text>{{ body.description }}</text>
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
    body: {
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
			let key
			if (this.body.type) {
				key = this.body.type.toString()
			}
      return key ? map[key] : ''
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
			margin: 20rpx 0;
			text-align: justify;
		}
	}
	.list-extra {
		position: relative;
	}
</style>
