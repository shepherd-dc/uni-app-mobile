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
			if (v.added) return
			console.log('addVaccine', v)
			const db = this.$db
			const res = await db.collection('user-vaccine').add({
				vaccine_id: v._id,
				vaccine_name: v.name,
				age_id: v.age_id,
				user_id: db.env.uid
			})
			// TODO: 添加成功后，前端自行处理，不请求刷新列表
			this.added = true
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
