<template>
  <view class="vaccine">
    <view class="header">
      <view
        class="add"
        @tap="toAdd">
        <uni-icons
          type="plusempty"
          size="16"></uni-icons>
        <text>添加自费</text>
      </view>
      <view class="tip">
        <text>接种须知</text>
      </view>
    </view>
    <view class="body">
      <xc-list :list="list"></xc-list>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'
import { getVaccineList } from '@/service/vaccine'
export default {
	onLoad () {
	  loginCheck()
	},
	onShow () {
	  if (this.hasLogin) this.getVaccineList()
	},
  data () {
    return {
      list: []
    }
  },
	computed: mapState(['hasLogin']),
  methods: {
		async getVaccineList () {
			// 未添加自费时, 默认只显示免费
			const res = await getVaccineList(0) // type: 0 免费
			console.log('getVaccineList', res)
			const { data } = res
			this.list = data || []
		},
    toAdd () {
      this.$navigateTo('/vaccine/add')
    }
  }
}
</script>

<style lang="less" scoped>
.vaccine {
	height: 100%;
	width: 100%;
	background-color: #f8f8f8;
}
.header {
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	padding: 20rpx;
	border-bottom: 8rpx solid #f8f8f8;
	.tip {
		color: #56ceab;
	}
}
.body {
}
</style>
