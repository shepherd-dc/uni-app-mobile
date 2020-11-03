<template>
  <view class="breastfeeding">
    <view class="form">
      <u-form
        ref="uForm"
        :label-width="180"
        :model="form">
        <u-form-item label="喂奶乳房">
          <u-input
            v-model="form.breast"
            :select-open="actionSheetShow"
            type="select"
            placeholder="请选择"
            @click="actionSheetShow = true" />
          <u-action-sheet
            :list="actionSheetList"
            v-model="actionSheetShow"
            :border-radius="20"
            @click="actionSheetCallback"></u-action-sheet>
        </u-form-item>
        <u-form-item label="开始时间">
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
        <u-form-item label="结束时间">
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
            v-model="duration"
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
        <xc-image-upload
          ref="upload"
          @change="handleUploadChange" />
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
export default {
  data () {
    return {
      form: {
        breast: '',
        startTime: '',
        endTime: '',
        note: ''
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
      duration: '',
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
  methods: {
    // 点击actionSheet回调
    actionSheetCallback (index) {
      this.form.breast = this.actionSheetList[index].text
    },
    confirmStartTime (e) {
      this.startTime = e.timestamp
      if (this.endTime && !this.validateTime(this.startTime, this.endTime, 1)) {
        return
      }
      this.form.startTime = this.formatTime(e)
      if (this.endTime) {
			  this.duration = Math.round((this.endTime - this.startTime) / 60) + '分钟'
      }
    },
    confirmEndTime (e) {
      this.endTime = e.timestamp
      if (!this.validateTime(this.startTime, this.endTime, 2)) {
        return
      }
      this.form.endTime = this.formatTime(e)
      if (this.startTime) {
        this.duration = Math.round((this.endTime - this.startTime) / 60) + '分钟'
      }
    },
    formatTime (e) {
      const { year, month, day, hour, minute } = e
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    validateTime (t1 = 0, t2 = 0, flag) {
      const diff = t2 - t1
      if (diff < 0) {
        if (flag === 1) {
          this.$toast('开始时间不能晚于结束时间')
          this.startTime = this.form.startTime = ''
          this.duration = ''
        } else if (flag === 2) {
          this.$toast('结束时间不能早于开始时间')
          this.endTime = this.form.endTime = ''
          this.duration = ''
        }
			  return false
      }
      return true
    },
    handleUploadChange (photos) {
      this.photos = photos
      console.log('photos', photos)
    },
    submitForm () {
      console.log('submitForm', this.form)
      console.log('uploadPhotos', this.photos)
    },
    resetForm () {
      this.form = {
        breast: '',
        startTime: '',
        endTime: '',
        note: ''
      }
      this.duration = ''
      this.$refs.upload.clear()
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
