<template>
  <view class="breastfeeding">
		<view v-if="loading" class="loading">
			<u-loading size="50" mode="circle"></u-loading>
		</view>
		<view v-else class="record-list">
			<xc-header @left="toAdd" />
			<xc-list
			  v-for="(l, i) in list"
			  :key="l._id">
			  <xc-list-body
			    :data="l"
			    @click.native="toDetail(l._id)">
			    <template v-slot:images>
			      <xc-media-preview :images="l.photos" />
			    </template>
			  </xc-list-body>
			</xc-list>
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
      this.list = res.data.map(item => {
        item.type = item.breast.substring(0, 2)
        item.title = `${item.startTime}~${item.endTime.split(' ')[1]}`
        item.extra = item.duration
        item.description = item.note
        return item
      })
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
</style>
