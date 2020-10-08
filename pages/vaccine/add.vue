<template>
	<view class="vaccine">
		<view class="body">
			<xc-list
				:tag="false"
				:showDate="false"
				extra="button"
				:list="list" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{
						_id: '1',
						month: 1,
						month_name: '1月龄',
						age: 1/12,
						age_name: '',
						vaccine: [
							{
								_id: '1',
								age_id: '1',
								type: 0,
								name: '无细胞百白破疫苗',
								times: 1,
								description: '预防流行性脑脊髓膜炎（流脑）',
								tips: 'A+C群流脑疫苗；与上次间隔不少于1年；加强免疫',
								done: 0
							},
							{
								_id: '2',
								age_id: '1',
								type: 1,
								name: '进口五价轮状病毒减毒活疫苗',
								times: 1,
								description: '预防血清型G1、G2、G3、G4、G9导致的婴幼儿轮状病毒胃肠炎。',
								tips: '6-12周龄',
								done: 0
							}
						]
					},
					{
						_id: '2',
						month: 2,
						month_name: '2月龄',
						age: 1/6,
						age_name: '',
						vaccine: [
							{
								_id: '1',
								age_id: '2',
								type: 0,
								name: '五联疫苗',
								times: 2,
								description: '预防百日咳、白喉、破伤风、脊髓灰质炎以及b型流感嗜血杆菌引起的侵入性感染。',
								tips: 'A+C群流脑疫苗；与上次间隔不少于1年；加强免疫',
								done: 0
							},
							{
								_id: '2',
								age_id: '2',
								type: 1,
								name: '进口五价轮状病毒减毒活疫苗',
								times: 1,
								description: '预防轮状病毒胃肠炎。',
								tips: '6-12周龄',
								done: 0
							}
						]
					},
					{
						_id: '18',
						month: 18,
						month_name: '18月龄',
						age: 1.5,
						age_name: '1.5岁',
						vaccine: [
							{
								_id: '1',
								age_id: '18',
								type: 0,
								name: '无细胞百白破疫苗',
								times: 1,
								description: '预防流行性脑脊髓膜炎',
								tips: 'A+C群流脑疫苗；与上次间隔不少于1年；加强免疫',
								done: 0
							},
							{
								_id: '2',
								age_id: '18',
								type: 1,
								name: '进口五价轮状病毒减毒活疫苗',
								times: 1,
								description: '预防轮状病毒胃肠炎。',
								tips: '6-12周龄',
								done: 0
							}
						]
					}
				]
			}
		},
		methods: {
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
.body {
}
</style>
