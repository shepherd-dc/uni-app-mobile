<template>
  <view class="food-supplement-detail">
    <detail-layout
      :detail="detail"
      :loading="loading"
      module="foodSupplement"
    >
			<template v-slot:detail-extra="{detail}">
				<view class="ingredients">{{ detail.ingredients }}</view>
			</template>
		</detail-layout>
  </view>
</template>

<script>
import DetailLayout from '../components/detail-layout'
import DetailMixin from '@/mixins/detail'
import { getRecord, foodSupplementCollection } from '@/service/toolbox'
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
      const result = await getRecord(foodSupplementCollection, this.id)
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
	.food-supplement-detail {
		width: 100%;
		position: relative;
	}
	.ingredients {
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #333;
	}
</style>
