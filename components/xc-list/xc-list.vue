<template>
  <view class="list-container">
    <view class="list-item">
      <slot name="header">
        <view
          v-if="header"
          class="list-header">
          <view class="header-item header-icon"></view>
          <text class="header-item header-title">{{ '标题' }}</text>
          <text class="header-item header-extra">{{ '标题extra' }}</text>
        </view>
      </slot>
      <view class="list-body">
				<template v-if="extra">
					<slot name="extra"></slot>
				</template>
				<template v-else>
					<slot>
					  <xc-list-body
							:body="body"
							@click.native="$emit('toDetail', body)">
						</xc-list-body>
					</slot>
				</template>
      </view>
      <view
        v-if="$slots.footer"
        class="list-footer">
        <slot name="footer"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    header: {
      type: Boolean,
      default: false
    },
		body: {
		  type: Object,
		  default: () => ({})
		},
		extra: {
		  type: Boolean,
		  default: false
		}
  }
}
</script>

<style lang="less" scoped>
	.list-item {
		background-color: #fff;
		padding: 0 20rpx;
		margin-bottom: 10rpx;
	}
	.list-header {
		display: flex;
		padding-top: 20rpx;
		padding-bottom: 10rpx;
		color: #333;
		.header-item {
			margin-right: 20rpx;
		}
		.header-icon {
			width: 8rpx;
			height: 40rpx;
			background-color: #56ceab;
		}
		.header-extra {
			color: #666;
		}
	}
	.list-body {
		&:last-child {
			.child-item {
				border-bottom: none;
				padding-bottom: none;
			}
		}
	}
	.list-footer {
		// color: #3CC51F;
		color: #666;
		font-size: 28rpx;
		margin-top: 20rpx;
	}
</style>
