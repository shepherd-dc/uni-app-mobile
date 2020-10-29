<template>
  <view class="baby-info">
    <view class="baby-info-form">
      <u-cell-group>
        <u-cell-item
          :title-style="{width: '160rpx'}"
          :arrow="false"
          title="姓名">
          <u-input v-model="formData.name" />
        </u-cell-item>
        <u-cell-item
          :title-style="{width: '160rpx'}"
          :arrow="false"
          title="性别">
          <u-radio-group v-model="formData.gender">
            <u-radio
              v-for="(item, index) in radioList"
              :label-size="28"
              :key="index"
              :name="item.key"
              active-color="#07c160">
              {{ item.value }}
            </u-radio>
          </u-radio-group>
        </u-cell-item>
        <u-cell-item
          :title-style="{width: '160rpx'}"
          :arrow="true"
          :value-style="{'text-align': 'left'}"
          title="出生日期">
          <picker
            :value="formData.birthday"
            :start="startDate"
            :end="endDate"
            mode="date"
            @change="bindDateChange">
            <view
              :class="{'placeholder': !formData.birthday}"
              class="date-item">{{ formData.birthday || '请选择出生日期' }}</view>
          </picker>
        </u-cell-item>
      </u-cell-group>
      <view class="btn-group">
        <u-button
          class="custom-btn"
          type="default"
          shape="circle"
          @click="formReset">重 置</u-button>
        <u-button
          class="custom-btn"
          type="success"
          shape="circle"
          @click="formSubmit">确 定</u-button>
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
      radioList: [
        {
          key: '1',
          value: '男'
        },
        {
          key: '2',
          value: '女'
        }
      ],
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
    bindDateChange ({ detail }) {
      this.formData.birthday = detail.value
    },
    formValidate () {
      for (const key of Object.keys(this.rules)) {
        if (!validate(key, this.rules, this.formData)) {
          return false
        }
      }
      return true
    },
    async formSubmit () {
      if (this.formValidate()) {
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
	.date-item.placeholder {
		color: #C4C4D6;
		font-size: 28rpx;
	}
</style>
