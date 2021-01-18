<template>
  <view class="nurturing-toolbox-list" :class="{'bg-color': !loading}">
    <view
      v-if="loading"
      class="loading">
      <u-loading
        size="50"
        mode="circle"></u-loading>
    </view>
    <view
			v-else
      class="record-list">
			<template>
				<slot name='header'>
					<xc-header @left="toAdd" />
				</slot>
			</template>
			<template>
				<slot>
					<view
					  v-if="list.length"
					  class="record-list">
					  <xc-list
					    v-for="(l, i) in list"
					    :key="l._id">
					    <xc-list-body
					      :body="l"
					      @click.native="toDetail(l._id)">
					      <template v-slot:images>
					        <xc-media-upload
					          :images="l.photos"
					          :editable="false" />
					      </template>
					    </xc-list-body>
					  </xc-list>
					</view>
					<view
					  v-else
					  class="empty">
					  <u-empty
					    text="还没有添加记录哦~"
					    mode="favor"></u-empty>
					  <u-button
					    :custom-style="{marginTop: '20rpx'}"
					    type="success"
					    @click="toAdd">
					    <u-icon name="plus"></u-icon>
					    <text>添加记录</text>
					  </u-button>
					</view>
				</slot>
			</template>
    </view>
  </view>
</template>

<script>
export default {
	props: {
		module: {
			type: String,
			default: undefined
		},
		list: {
			type: Array,
			default: () => []
		},
		loading: {
			type: Boolean,
			default: true
		}
	},
  methods: {
    toAdd () {
      this.$navigateTo(`/nurturingToolbox/${this.module}/add`)
    },
    toDetail (id) {
      this.$navigateTo(`/nurturingToolbox/${this.module}/detail?params=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
	.nurturing-toolbox-list {
		width: 100%;
		padding-top: 90rpx;
	}
	.bg-color {
		background-color: #f8f8f8;
	}
	.loading {
		text-align: center;
		width: 100%;
		height: 100%;
		padding-top: 100rpx;
	}
	.empty {
		width: 100%;
		height: 600rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
