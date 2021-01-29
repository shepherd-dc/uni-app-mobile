<template>
  <view class="uncomfortable">
    <list-layout
      :list="list"
      :loading="loading"
      module="uncomfortable" />
  </view>
</template>

<script>
import { getRecordsList } from '@/service/toolbox'
import ListLayout from '../components/list-layout'
import toolboxConfig from '@/config/toolbox'
const { uncomfortable: { collection } } = toolboxConfig
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
          item.typeText = '不舒服'
          item.type = 2
          item.title = item.startTime
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
	.uncomfortable {
		width: 100%;
	}
</style>
