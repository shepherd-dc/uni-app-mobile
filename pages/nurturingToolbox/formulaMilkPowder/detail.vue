<template>
  <view class="bottle-breastfeeding">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="formulaMilkPowder"
    />
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord, formulaMilkPowderCollection } from '@/service/toolbox'
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
      const result = await getRecord(formulaMilkPowderCollection, this.id)
      const { data } = result
      console.log('getRecord', data)
      if (data && data.length) {
        const detail = data[0]
        detail.typeText = '配方'
        detail.type = -1
        detail.title = detail.feedingTime
        detail.extra = detail.feedingVolume
        detail.description = detail.note
        this.detail = detail
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
	.bottle-breastfeeding {
		width: 100%;
		position: relative;
	}
</style>
