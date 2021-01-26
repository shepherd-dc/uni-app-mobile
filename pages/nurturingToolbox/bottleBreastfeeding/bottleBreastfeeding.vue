<template>
  <view class="bottle-breastfeeding">
    <list-layout
      :list="list"
      :loading="loading"
      module="bottleBreastfeeding" />
  </view>
</template>

<script>
import { getRecordsList, bottleBreastfeedingCollection } from '@/service/toolbox'
import ListLayout from '../components/list-layout'
export default {
  components: {
    ListLayout
  },
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
      const res = await getRecordsList(bottleBreastfeedingCollection)
      console.log('getRecordsList', res)
      const { data } = res
      if (data && data.length) {
        this.list = res.data.map(item => {
          item.typeText = '瓶喂'
          item.type = 1
          item.title = item.feedingTime
          item.extra = item.feedingVolume
          item.description = item.note
          return item
        })
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
	.bottle-breastfeeding {
		width: 100%;
	}
</style>
