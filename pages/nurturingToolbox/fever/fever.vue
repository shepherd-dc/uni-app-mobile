<template>
  <view class="fever">
    <list-layout
      :list="list"
      :loading="loading"
      module="fever" />
  </view>
</template>

<script>
import { getRecordsList } from '@/service/toolbox'
import ListLayout from '../components/list-layout'
import toolboxConfig from '@/config/toolbox'
const { fever: { collection } } = toolboxConfig
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
          item.typeText = item.measurement
          item.type = 2
          item.title = item.recordingTime
					item.extra = item.temperature
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
	.fever {
		width: 100%;
	}
</style>
