<template>
  <view class="fever">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="fever"
    />
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord } from '@/service/toolbox'
import toolboxConfig from '@/config/toolbox'
const { fever: { collection } } = toolboxConfig

export default {
  components: {
    DetailLayout
  },
  mixins: [
    DetailMixin
  ],
  onShow () {
		 this.getRecord()
  },
  data () {
    return {
      detail: {},
      loading: true
    }
  },
  methods: {
    async getRecord () {
      const result = await getRecord(collection, this.id)
      const { data } = result
      console.log('getRecord', data)
      if (data && data.length) {
        const detail = data[0]
        detail.typeText = detail.measurement
        detail.type = 2
        detail.title = detail.recordingTime
        detail.extra = detail.temperature
        detail.description = detail.note
        this.detail = detail
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
	.fever {
		width: 100%;
		position: relative;
	}
</style>
