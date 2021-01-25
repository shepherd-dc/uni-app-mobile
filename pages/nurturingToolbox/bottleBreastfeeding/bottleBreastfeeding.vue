<template>
  <view class="bottle-breastfeeding">
    <list-layout
      :list="list"
      :loading="loading"
      module="bottleBreastfeeding" />
  </view>
</template>

<script>
import { getRecordsList } from '@/service/toolbox-breastfeeding'
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
    }
  }
}
</script>

<style lang="less" scoped>
	.bottle-breastfeeding {
		width: 100%;
	}
</style>
