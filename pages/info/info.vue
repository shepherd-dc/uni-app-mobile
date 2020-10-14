<template>
	<view class="baby-info">
		<view class="baby-info-form">
			<van-cell-group>
				<van-field
					label="姓名"
					:value="formData.name"
					placeholder="请输入姓名"
					:clearable="true"
					@input="bindNameChange"
				/>
				<van-cell title="性别" clickable value-class="custom-cell">
					<van-radio-group :value="formData.gender" @change="bindGenderChange" class="gender-radio">
						<van-radio name="1" checked-color="#07c160">男</van-radio>
						<van-radio name="2" checked-color="#07c160">女</van-radio>
					</van-radio-group>
				</van-cell>
				<van-cell title="出生日期" clickable value-class="custom-cell">
					<picker mode="date" :value="formData.born_data" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="date-item">{{ formData.born_data }}</view>
					</picker>
				</van-cell>
			</van-cell-group>
			<view class="btn-group">
				<van-button class="custom-btn" type="default" size="large" round @tap="formReset">取消</van-button>
				<van-button class="custom-btn"  type="primary" size="large" round @tap="formSubmit">确定</van-button>
			</view>
		</view>
	</view>
</template>
<script>
import { getSimpleDate } from '@/utils/datetime'
export default {
	data() {
		return {
			startDate: getSimpleDate('start'),
			endDate: getSimpleDate('end'),
			formData: {
				name: '',
				gender: '1',
				born_data: getSimpleDate()
			}
		}
	},
	methods: {
		bindNameChange ({ detail }) {
			this.formData.name = detail
		},
		bindDateChange ({ detail }) {
			this.formData.born_data = detail.value
		},
		bindGenderChange ({ detail }) {
			this.formData.gender = detail
		},
		formSubmit () {
			console.log('formData', this.formData)
			this.$navigateTo('/vaccine/vaccine')
		},
		formReset () {
			this.formData = {
				name: '',
				gender: '1',
				born_data: getSimpleDate()
			}
			uni.navigateBack()
		}
	}
}
</script>

<style lang="less" scoped>
	.baby-info {
		width: 100%;
	}
	.btn-group {
		margin-top: 50upx;
		display: flex;
		justify-content: space-around;
		.custom-btn {
			margin: 0 20upx;
			flex: 1;
		}
	}
	.gender-radio {
		display: flex;
		align-items: center;
	}
	/deep/.van-radio {
		margin-right: 20rpx;
	}
	/deep/.custom-cell.van-cell__value {
		flex: 2.5;
		text-align: left;
	}
	/deep/.van-button--large {
		height: 80rpx;
	}
</style>
