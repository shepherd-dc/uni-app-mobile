<template>
  <view class="food-supplement">
    <list-layout
      :list="list"
      :loading="loading"
			:extra="true"
      module="foodSupplement">
				<template v-slot:list-extra="{item}">
					<xc-list-body
						:body="item"
						@click.native="toDetail(item._id)">
						<template v-slot:extra>
							<view class="ingredients">{{ item.ingredients }}</view>
						</template>
					</xc-list-body>
				</template>
		</list-layout>
  </view>
</template>

<script>
import { getRecordsList, foodSupplementCollection } from '@/service/toolbox'
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
      const res = await getRecordsList(foodSupplementCollection)
      console.log('getRecordsList', res)
      const { data } = res
      if (data && data.length) {
        this.list = res.data.map(item => {
          item.typeText = '辅食'
          item.type = -1
          item.title = item.feedingTime
          item.extra = item.feedingVolume
          item.description = item.note
          return item
        })
      }
      this.loading = false
    },
		toDetail (id) {
			this.$navigateTo('/nurturingToolbox/foodSupplement/detail?params=' + id)
		}
  }
}
</script>

<style lang="less" scoped>
	.food-supplement {
		width: 100%;
	}
	.ingredients {
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #333;
	}
</style>
