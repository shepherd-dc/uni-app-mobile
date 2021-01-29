<template>
  <view class="sleeping">
    <list-layout
      :list="list"
      :loading="loading"
      module="sleeping" />
  </view>
</template>

<script>
import { getRecordsList } from '@/service/toolbox'
import ListLayout from '../components/list-layout'
import toolboxConfig from '@/config/toolbox'
const { sleeping: { collection } } = toolboxConfig

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
      const res = await getRecordsList(collection)
      console.log('getRecordsList', res)
      const { data } = res
      if (data && data.length) {
        this.list = res.data.map(item => {
          item.typeText = '睡眠'
          item.type = 1
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
	.sleeping {
		width: 100%;
	}
</style>
