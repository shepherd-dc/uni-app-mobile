<template>
  <view class="list-container">
    <view
      v-for="(l, i) in list"
      :key="l._id"
      class="list">
      <view
        v-if="l.vaccine.length"
        class="list-item">
        <view class="list-header">
          <view class="header-item header-icon"></view>
          <text
            v-if="showDate"
            class="header-item header-title">2019年{{ i+1 }}月15日</text>
          <text class="header-item header-extra">{{ l.month_name || l.age_name }}</text>
        </view>
        <view
          v-for="v in l.vaccine"
          :key="v._id"
          class="child-item"
					:class="{'item-done': v.done}" >
          <view class="list-body">
            <view class="list-main">
              <view class="title">
                <view class="title-main">
                  <text
                    v-if="tag"
                    :class="{'self-pay': v.type === 1}"
                    class="type">{{ v.type === 1 ? '自费' : '免费' }}</text>
                  <text class="name">{{ v.name }}</text>
                </view>
                <view class="title-extra">{{ v.times }}</view>
              </view>
              <view
                v-if="description"
                class="description">
                <text>{{ v.description }}</text>
              </view>
            </view>
            <view class="list-extra">
              <template v-if="extra === 'checkbox'">
                <checkbox-group @tap="tapCheckbox(v)">
                  <label>
                    <text
                      v-if="v.done"
                      class="date">{{ v.done_time }}</text>
                    <checkbox
                      :value="v._id"
                      :checked="v.done"/>
                  </label>
                </checkbox-group>
              </template>
              <template v-if="extra === 'button'">
                <view
									@tap="tapButton(v)"
                  class="button"
									:class="{added: v.added}"
                  type="primary">{{ v.added ? '已添加' : '未添加' }}</view>
              </template>
            </view>
          </view>
          <view
            v-if="v.tips"
            class="list-footer">
            <text>Tips: {{ v.tips }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tag: {
      type: Boolean,
      default: true
    },
    description: {
      type: Boolean,
      default: true
    },
    showDate: {
      type: Boolean,
      default: true
    },
    extra: {
      type: String,
      default: 'checkbox'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
		tapCheckbox (v) {
			this.$emit('done', v)
		},
		tapButton (v) {
			this.$emit('add', v)
		}
  }
}
</script>

<style lang="less" scoped>
	.list-item {
		background-color: #fff;
		padding: 20rpx 20rpx 0;
		margin-bottom: 8rpx;
	}
	.list-header {
		display: flex;
		padding-bottom: 10rpx;
		border-bottom: 2rpx solid #f8f8f8;
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
	.child-item {
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #f8f8f8;
		&:last-child {
			padding-bottom: none;
			border-bottom: none;
		}
	}
	.list-body {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;
	}
	.list-main {
		.title {
			display: flex;
			flex-wrap: wrap;
			// margin-bottom: 20rpx;
			.type {
				background-color: #56ceab;
				border-radius: 20rpx;
				color: #fff;
				font-size: 26rpx;
				padding: 2rpx 20rpx;
				margin-right: 20rpx;
			}
			.type.self-pay {
				background-color: #f7647e;
			}
			.name {
				margin-right: 20rpx;
			}
			.title-extra {
				color: #666;
			}
		}
		.description {
			color: #999;
			font-size: 28rpx;
			margin-top: 20rpx;
		}
	}
	.list-extra {
		position: relative;
		.date {
			position: absolute;
			bottom:0;
			right: 60rpx;
			width: 200rpx;
			font-size: 24rpx;
			color: #999;
		}
		.button {
			background-color: #56ceab;
			border-radius: 60rpx;
			color: #fff;
			font-size: 28rpx;
			padding: 8rpx 30rpx;
			min-width: 100rpx;
			text-align: center;
			margin-left: 20rpx;
		}
		.button.added {
			background-color: #fff;
			border: 1px solid #56ceab;
			color: #666;
		}
	}
	.list-footer {
		// color: #3CC51F;
		color: #666;
		font-size: 28rpx;
		margin-top: 20rpx;
	}
	.item-done {
		.type {
			background-color: #ccc!important;
		}
		.name, .title-extra, .description, .list-footer {
			color: #ccc!important;
		}
		// .name {
		// 	text-decoration: line-through;
		// 	color: #999;
		// }
		// .title-extra {
		// 	text-decoration: line-through;
		// 	color: #999!important;
		// }
		// .description {
		// 	text-decoration: line-through;
		// }
		// .list-footer {
		// 	text-decoration: line-through;
		// 	color: #999!important;
		// }
	}
</style>
