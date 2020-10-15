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
				<van-cell title="出生日期" clickable is-link value-class="custom-cell">
					<picker mode="date" :value="formData.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="date-item" :class="{'placeholder': !formData.birthday}">{{ formData.birthday || '请选择出生日期' }}</view>
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
import validate from '@/utils/validate.js'
import { addBabyInfo } from '@/service/info'
export default {
	data () {
		return {
			startDate: getSimpleDate('start'),
			endDate: getSimpleDate('end'),
			formData: {
				name: '',
				gender: '',
				birthday: ''
			},
			// 表单验证规则
			rules: {
			  name: {
			    rule: /\S/,
			    msg: '请填写姓名'
			  },
				gender: {
				  rule: /\S/,
				  msg: '请选择性别'
				},
				birthday: {
				  rule: /\S/,
				  msg: '请选择出生日期'
				}
			}
		}
	},
	methods: {
		bindNameChange ({ detail }) {
			this.formData.name = detail
		},
		bindDateChange ({ detail }) {
			this.formData.birthday = detail.value
		},
		bindGenderChange ({ detail }) {
			this.formData.gender = detail
		},
		formValidate () {
			for (let key of Object.keys(this.rules)) {
				if (!validate(key, this.rules, this.formData)) {
					return false
				}
			}
			return true
		},
		async formSubmit () {
			if(this.formValidate()) {
				console.log('formData', this.formData)
				await addBabyInfo(this.formData)
				uni.navigateBack()
			}
		},
		formReset () {
			this.formData = {
				name: '',
				gender: '',
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
	.date-item.placeholder {
		color: #C8C9CC;
	}
	/deep/.van-radio {
		margin-right: 20rpx;
	}
	/deep/.van-cell__title {
		max-width:6.2em;
		min-width:6.2em;
		margin-right: 12px;
		color: #646566;
	}
	/deep/.custom-cell.van-cell__value {
		text-align: left;
	}
	/deep/.van-button--large {
		height: 80rpx;
	}
</style>
