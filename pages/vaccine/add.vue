<template>
  <view class="vaccine">
    <view class="body">
      <xc-list
        :tag="false"
        :show-date="false"
        :list="list"
        extra="button"
				@add="addVaccine" />
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'
import { getVaccineList, addVaccine, cancelAddVaccine } from '@/service/vaccine'
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
			added: false
    }
  },
	computed: mapState(['hasLogin']),
  methods: {
		async getVaccineList () {
			const res = await getVaccineList(1) // type: 1 自费
			console.log('getVaccineList', res)
			const { data } = res
			this.list = data || []
		},
		async addVaccine (v) {
			if (this.addLoading) {
				uni.showToast({
					title: '操作过快',
					icon: 'none'
				})
				return
			}
			this.addLoading = true
			if (v.added) {
				await cancelAddVaccine(v._id)
				this.addLoading = false
				this.added = false
			} else {
				await addVaccine(v)
				this.addLoading = false
				// TODO: 添加成功后，前端自行处理，不请求刷新列表
				this.added = true
			}
			this.getVaccineList()
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
.body {
}
</style>
