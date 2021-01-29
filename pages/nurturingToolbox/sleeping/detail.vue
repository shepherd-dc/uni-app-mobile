<template>
  <view class="sleeping">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="sleeping"
    />
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord } from '@/service/toolbox'
import toolboxConfig from '@/config/toolbox'
const { sleeping: { collection } } = toolboxConfig

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
				detail.typeText = '睡眠'
				detail.type = 1
        detail.title = `${detail.startTime}~${detail.endTime.split(' ')[1]}`
        detail.extra = detail.duration
        detail.description = detail.note
        this.detail = detail
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
	.sleeping {
		width: 100%;
		position: relative;
	}
</style>
