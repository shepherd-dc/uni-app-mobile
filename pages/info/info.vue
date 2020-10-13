<template>
	<view class="baby-info">
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view class="header">
					完善宝宝信息
				</view>
				<uni-list>
					<uni-list-item>
						<view slot="header" class="slot-box">姓名</view>
						<view slot="body" class="slot-box slot-view">
							<input class="uni-input" name="name" placeholder="请输入姓名" />
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="slot-box">性别</view>
						<view slot="body" class="slot-box slot-view">
							<radio-group name="gender">
								<label class="gender-item">
									<radio value="男" />男
								</label>
								<label class="gender-item">
									<radio value="女" />女
								</label>
							</radio-group>
						</view>
					</uni-list-item>
					<uni-list-item link >
						<view slot="header" class="slot-box">出生日期</view>
						<view slot="body" class="slot-box slot-view">
							<picker mode="date" :value="date" name="date" :start="startDate" :end="endDate" @change="bindDateChange">
								<view class="date-item">{{ date }}</view>
							</picker>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="btn-group">
					<button type="default" formType="reset">Reset</button>
					<button type="primary" formType="submit">Submit</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	function getDate(type) {
		const date = new Date();
	
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
	
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	}
	export default {
		data() {
			return {
				date: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),
				pickerHidden: true,
				chosen: ''
			}
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			pickerConfirm: function(e) {
				this.pickerHidden = true
				this.chosen = e.target.value
			},
			pickerCancel: function(e) {
				this.pickerHidden = true
			},
			pickerShow: function(e) {
				this.pickerHidden = false
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				this.$navigateTo('/vaccine/vaccine')
			},
			formReset: function(e) {
				console.log('清空数据')
				this.chosen = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	.baby-info {
		width: 100%;
		padding: 30upx;
	}
	.slot-view {
		display: flex;
		align-items: center;
	}
	.gender-item {
		margin-right: 20upx;
	}
	.header {
		margin-bottom: 20upx;
		text-align: center;
	}
	.slot-box {
		font-size: 28rpx;
		color: #3b4144;
		margin-right: 20upx;
	}
	.btn-group {
		margin-top: 40upx;
		display: flex;
		justify-content: space-around;
		box-sizing: border-box;
		button {
			margin-right: 20upx;
			flex: 1;
		}
	}
</style>
