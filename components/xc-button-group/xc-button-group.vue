<template>
  <view class="btn-group">
    <u-button
      class="custom-btn"
      type="default"
      shape="circle"
      @click="reset">{{ resetText }}</u-button>
    <u-button
      class="custom-btn"
      type="success"
      shape="circle"
      @click="confirm">{{ confirmText }}</u-button>
  </view>
</template>

<script>
export default {
  props: {
    resetText: {
      type: String,
      default: '重 置'
    },
    confirmText: {
      type: String,
      default: '确 定'
    }
  },
  methods: {
    reset () {
      this.$emit('reset')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="less" scoped>
	.btn-group {
		margin: 40upx 0;
		display: flex;
		justify-content: space-between;
		.custom-btn {
			flex: 1;
			&:first-child {
				margin-right: 20upx;
			}
		}
	}
</style>
