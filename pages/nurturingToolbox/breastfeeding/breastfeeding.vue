<template>
  <view class="breastfeeding">
    <view class="form">
      <u-form
        ref="uForm"
        :label-width="180"
        :error-type="errorType"
        :model="form">
        <u-form-item
          label="喂奶乳房"
          prop="breast">
          <u-input
            v-model="form.breast"
            :select-open="actionSheetShow"
            type="select"
            placeholder="请选择喂奶乳房"
            @click="actionSheetShow = true" />
          <u-action-sheet
            :list="actionSheetList"
            v-model="actionSheetShow"
            :border-radius="20"
            @click="actionSheetCallback"></u-action-sheet>
        </u-form-item>
        <u-form-item
          label="开始时间"
          prop="startTime">
          <u-input
            v-model="form.startTime"
            :select-open="startTimeShow"
            type="select"
            placeholder="请选择开始时间"
            @click="startTimeShow = true" />
          <u-picker
            v-model="startTimeShow"
            :params="params"
            mode="time"
            confirm-color="#56ceab"
            @confirm="confirmStartTime"></u-picker>
        </u-form-item>
        <u-form-item
          label="结束时间"
          prop="endTime">
          <u-input
            v-model="form.endTime"
            :select-open="endTimeShow"
            type="select"
            placeholder="请选择结束时间"
            @click="endTimeShow = true" />
          <u-picker
            v-model="endTimeShow"
            :params="params"
            mode="time"
            confirm-color="#56ceab"
            @confirm="confirmEndTime"></u-picker>
        </u-form-item>
        <u-form-item label="持续时间">
          <u-input
            v-model="form.duration"
            :placeholder="' '"
            disabled />
        </u-form-item>
        <u-form-item :border-bottom="false">
          <view>随手记</view>
          <u-input
            v-model="form.note"
            :clearable="false"
            class="custom-input"
            auto-height
            placeholder="宝宝吃奶精神状态、是否吐奶、拍嗝等"
            type="textarea" />
        </u-form-item>
        <xc-media-choose
          ref="chooseMedia"
          @change="handleChosenChange" />
      </u-form>
    </view>
    <u-alert-tips
      :show="tipsShow"
      :close-able="true"
      type="warning"
      title="温馨提示："
      description="单侧喂奶时间不短于5分钟，保证宝宝吃到后奶。"
      @close="tipsShow = false" />
    <xc-button-group
      confirm-text="保 存"
      @confirm="submitForm"
      @reset="resetForm" />
  </view>
</template>

<script>
import { addRecord } from '@/service/toolbox-breastfeeding'
import uploadFiles from '@/utils/upload'
export default {
  data () {
    return {
      form: {
        breast: '',
        startTime: '',
        endTime: '',
        duration: '',
        note: ''
      },
      errorType: ['toast'],
      rules: {
        breast: [
          {
            required: true,
            message: '请选择喂奶乳房',
            trigger: ['blur', 'change']
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: ['blur', 'change']
          }
        ],
        endTime: [
				  {
				    required: true,
				    message: '请选择结束时间',
				    trigger: ['blur', 'change']
				  }
        ]
      },
      actionSheetList: [
        {
          text: '双侧乳房'
        },
        {
          text: '左侧乳房'
        },
        {
          text: '右侧乳房'
        }
      ],
      actionSheetShow: false,
      startTimeShow: false,
      endTimeShow: false,
      startTime: '',
      endTime: '',
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        // second: true,
        timestamp: true
      },
      tipsShow: true,
      photos: []
    }
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady () {
    this.$refs.uForm.setRules(this.rules)
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback (index) {
      this.form.breast = this.actionSheetList[index].text
    },
    confirmStartTime (e) {
      this.startTime = this.formatTime(e)
      if (this.endTime && !this.validateTime(this.startTime, this.endTime, 1)) {
        return
      }
      this.form.startTime = this.startTime
      if (this.endTime) {
			  this.form.duration = this.calculateDuration(this.endTime, this.startTime)
      }
    },
    confirmEndTime (e) {
      this.endTime = this.formatTime(e)
      if (!this.validateTime(this.startTime, this.endTime, 2)) {
        return
      }
      this.form.endTime = this.endTime
      if (this.startTime) {
        this.form.duration = this.calculateDuration(this.endTime, this.startTime)
      }
    },
    formatTime (e) {
      const { year, month, day, hour, minute } = e
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    validateTime (t1, t2, flag) {
      t1 = t1 ? new Date(t1).getTime() : 0
      t2 = t2 ? new Date(t2).getTime() : 0
      console.log(t1, t2)
      const diff = t2 - t1
      if (diff < 0) {
        if (flag === 1) {
          this.$toast('开始时间不能晚于结束时间')
          this.startTime = this.form.startTime = ''
          this.form.duration = ''
        } else if (flag === 2) {
          this.$toast('结束时间不能早于开始时间')
          this.endTime = this.form.endTime = ''
          this.form.duration = ''
        }
			  return false
      }
      return true
    },
    calculateDuration (t1, t2) {
      t1 = new Date(t1).getTime()
      t2 = new Date(t2).getTime()
      return (t1 - t2) / (1000 * 60) + '分钟'
    },
    handleChosenChange (photos) {
      this.photos = photos
    },
    async submitForm () {
      this.$refs.uForm.validate(async valid => {
        if (valid) {
					// 上传图片
					if (this.photos.length) {
						const files = await uploadFiles(this.photos)
						this.form.photos = files
					}
          const res = await addRecord(this.form)
					console.log('submitForm', res)
					this.$navigateTo('/nurturingToolbox/breastfeeding/detail?params=' + res.id)
        }
      })
    },
    resetForm () {
      this.form = {
        breast: '',
        startTime: '',
        endTime: '',
        duration: '',
        note: ''
      }
      this.form.duration = ''
      this.$refs.chooseMedia.clear()
    }
  }
}
</script>

<style lang="less" scoped>
	.breastfeeding {
		width: 100%;
		padding: 0 30rpx;
	}
	.form {
		margin-bottom: 40rpx;
	}
	/deep/ .custom-input textarea {
		min-height: 40rpx!important;
		color: #666;
	}
</style>
