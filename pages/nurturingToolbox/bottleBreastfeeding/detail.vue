<template>
	<view class="bottle-breastfeeding">
		<detail-layout
			module="bottleBreastfeeding" 
			:detail="detail" 
			:loading="loading"
			:delete="deleteFn"
		/>
	</view>
</template>

<script>
	import DetailLayout from '../components/detail-layout'
	import DetailMixin from '@/mixins/detail'
	import { getRecord, deleteRecord } from '@/service/toolbox-breastfeeding'
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
				loading: true,
				deleteFn: deleteRecord
			}
		},
		methods: {
		  async getRecord () {
		    const result = await getRecord(this.id)
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
	.bottle-breastfeeding {
		width: 100%;
		position: relative;
	}
</style>