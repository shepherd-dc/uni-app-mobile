<template>
  <view class="vaccine">
    <view class="body">
      <xc-list
        :tag="false"
        :show-date="false"
        :list="list"
        extra="button" />
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
			const res = await getVaccineList(1) // type: 1 自费
			console.log('getVaccineList', res)
			const { data } = res
			this.list = data || []
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
