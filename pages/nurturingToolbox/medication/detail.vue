<template>
  <view class="medication-detail">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="medication"
    >
			<xc-list-body :body="detail">
				<template v-slot:extra>
					<view class="medicine">{{ detail.medicineName }}</view>
				</template>
			</xc-list-body>
		</detail-layout>
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord } from '@/service/toolbox'
import toolboxConfig from '@/config/toolbox'
const { medication: { collection } } = toolboxConfig

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
        detail.typeText = '用药'
        detail.type = 2
        detail.title = detail.feedingTime
        detail.extra = detail.volume
        detail.description = detail.note
        this.detail = detail
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
	.medication-detail {
		width: 100%;
		position: relative;
	}
	.medicine {
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #333;
	}
</style>
