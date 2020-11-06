<template>
  <view class="xc-header">
    <view
      class="left"
      @tap="toLeft">
      <uni-icons
        color="#56ceab"
        type="plusempty"
        size="16"></uni-icons>
      <text class="right">{{ left }}</text>
    </view>
    <view
      class="right"
      @tap="toRight">
      <text>{{ right }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    left: {
      type: String,
      default: '添加记录'
    },
    right: {
      type: String,
      default: '记录规律'
    }
  },
  methods: {
  	toLeft () {
  		this.$emit('left')
  	},
    toRight () {
      this.$emit('right')
    }
  }
}
</script>

<style lang="less" scoped>
	.xc-header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 8rpx solid #f8f8f8;
		.right {
			color: #56ceab;
		}
	}

</style>
