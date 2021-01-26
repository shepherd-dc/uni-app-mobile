<template>
  <view class="breastfeeding">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="breastfeeding"
    />
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord, breastfeedingCollection } from '@/service/toolbox'
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
      const result = await getRecord(breastfeedingCollection, this.id)
      const { data } = result
      console.log('getRecord', data)
      if (data && data.length) {
        const detail = data[0]
        detail.typeText = detail.breast.substring(0, 2)
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
	.breastfeeding {
		width: 100%;
		position: relative;
	}
</style>
