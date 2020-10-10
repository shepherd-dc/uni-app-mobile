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
      <xc-list
			:list="list"
			@done="vaccineDone" />
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'
import { getVaccineList, doVaccine, undoVaccine } from '@/service/vaccine'
export default {
	onLoad () {
	  loginCheck()
	},
	onShow () {
	  if (this.hasLogin) this.getVaccineList()
	},
  data () {
    return {
      list: [],
			done: false
    }
  },
	computed: mapState(['hasLogin']),
  methods: {
		async getVaccineList () {
			// 未添加自费时, 默认只显示免费
			const res = await getVaccineList(0) // type: 0 免费
			console.log('getVaccineList', res.data)
			const { data } = res
			this.list = data || []
		},
		async vaccineDone (v) {
			if (this.doneLoading) {
				uni.showToast({
					title: '操作过快',
					icon: 'none'
				})
				return
			}
			this.doneLoading = true
			if (v.done) {
				await undoVaccine(v._id)
				this.doneLoading = false
				this.done = false
			} else {
				await doVaccine(v)
				this.doneLoading = false
				// TODO: 添加成功后，前端自行处理，不请求刷新列表
				this.done = true
			}
			this.getVaccineList()
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
