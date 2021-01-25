<template>
  <view class="breastfeeding">
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
      <xc-header @left="toAdd" />
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
    </view>
  </view>
</template>

<script>
import { getRecordsList } from '@/service/toolbox-breastfeeding'
export default {
  onShow () {
    this.getRecordsList()
  },
  data () {
    return {
      list: [],
      loading: true
    }
  },
  methods: {
    async getRecordsList () {
      const res = await getRecordsList()
      console.log('getRecordsList', res)
      const { data } = res
      if (data && data.length) {
        this.list = res.data.map(item => {
				  item.typeText = item.breast.substring(0, 2)
				  item.title = `${item.startTime}~${item.endTime.split(' ')[1]}`
				  item.extra = item.duration
				  item.description = item.note
				  return item
        })
      }
      this.loading = false
    },
    toAdd () {
      this.$navigateTo('/nurturingToolbox/breastfeeding/add')
    },
    toDetail (id) {
      this.$navigateTo('/nurturingToolbox/breastfeeding/detail?params=' + id)
    }
  }
}
</script>

<style lang="less" scoped>
	.breastfeeding {
		width: 100%;
		background-color: #f8f8f8;
		padding-top: 90rpx;
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
