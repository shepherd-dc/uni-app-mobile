<template>
  <view class="sleeping">
    <view class="form">
      <u-form
        ref="uForm"
        :label-width="180"
        :error-type="errorType"
        :model="form">
        <u-form-item
          label="入睡时间"
          prop="startTime">
          <u-input
            v-model="form.startTime"
            :select-open="startTimeShow"
            type="select"
            placeholder="请选择入睡时间"
            @click="startTimeShow = true" />
          <u-picker
            v-model="startTimeShow"
            :params="params"
            mode="time"
            confirm-color="#56ceab"
            @confirm="confirmStartTime"></u-picker>
        </u-form-item>
        <u-form-item
          label="醒来时间"
          prop="endTime">
          <u-input
            v-model="form.endTime"
            :select-open="endTimeShow"
            type="select"
            placeholder="请选择醒来时间"
            @click="endTimeShow = true" />
          <u-picker
            v-model="endTimeShow"
            :params="params"
            mode="time"
            confirm-color="#56ceab"
            @confirm="confirmEndTime"></u-picker>
        </u-form-item>
        <u-form-item label="睡眠时长">
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
            placeholder="记录下宝宝可爱的睡姿吧"
            type="textarea" />
        </u-form-item>
        <xc-media-upload
          ref="chooseMedia"
          :images="photos"
          @change="handleChosenChange" />
      </u-form>
    </view>
    <xc-button-group
      v-if="id"
      confirm-text="保 存"
      reset-text="取 消"
      @confirm="submitForm"
      @reset="cancel" />
    <xc-button-group
      v-else
      confirm-text="保 存"
      @confirm="submitForm"
      @reset="resetForm" />
  </view>
</template>

<script>
import { addRecord, getRecord, updateRecord } from '@/service/toolbox'
import uploadFiles, { deleteFiles } from '@/utils/upload'
import toolboxConfig from '@/config/toolbox'
const { sleeping: { collection } } = toolboxConfig

export default {
  onLoad (opt) {
	  this.id = opt.params
    if (this.id) {
		  this.getRecord()
    }
  },
  onShow () {
    console.log('edit id', this.id)
  },
  onReady () {
    const title = this.id ? '编辑记录' : '新增记录'
    uni.setNavigationBarTitle({ title })

    // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	  this.$refs.uForm.setRules(this.rules)
  },
  data () {
    return {
      id: undefined,
      form: {
        type: 0,
        startTime: '',
        endTime: '',
        duration: '',
        note: ''
      },
      errorType: ['toast'],
      rules: {
        startTime: [
          {
            required: true,
            message: '请选择入睡时间',
            trigger: ['blur', 'change']
          }
        ],
        endTime: [
				  {
				    required: true,
				    message: '请选择醒来时间',
				    trigger: ['blur', 'change']
				  }
        ]
      },
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
      photos: [],
      uploadedFiles: []
    }
  },
  methods: {
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
          this.$toast('入睡时间不能晚于醒来时间')
          this.startTime = this.form.startTime = ''
          this.form.duration = ''
        } else if (flag === 2) {
          this.$toast('醒来时间不能早于入睡时间')
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
      console.log('this.photos', this.photos)
    },
    async getRecord () {
		  const result = await getRecord(collection, this.id)
		  const { data } = result
		  if (data.length) {
		    const detail = data[0]
        const { type, startTime, endTime, duration, note, photos } = detail
        this.form.type = type
        this.form.startTime = this.startTime = startTime
        this.form.endTime = this.endTime = endTime
        this.form.duration = duration
        this.form.note = note
        this.uploadedFiles = photos ? photos.slice() : []
        this.photos = photos || []
		  }
		  console.log('getRecord', result)
    },
    async updateRecord (id, data) {
      const res = await updateRecord(collection, id, data)
      console.log('updateRecord', res)
      uni.showToast({
        title: '保存成功！',
        icon: 'none'
      })
    },
    handleEditedPhotos () {
      const editedPhotos = this.photos
      const remained = [] // 保留的图片
      const added = [] // 新增的图片
      editedPhotos.forEach(ep => {
        if (this.uploadedFiles.includes(ep)) {
          remained.push(ep)
        } else {
          added.push(ep)
        }
      })
      // 已上传的图片 - 保留的图片 = 删除的图片
      const deleted = this.uploadedFiles.filter(uf => !remained.includes(uf))
      return {
        added,
        deleted,
        remained
      }
    },
    async submitForm () {
      this.$refs.uForm.validate(async valid => {
        if (valid) {
          if (this.id) { // 有id为编辑
            // 比对编辑后图片的新增和删除情况, 以及保留未变的图片
            const { added, deleted, remained } = this.handleEditedPhotos()
            // 上传新增的图片
            if (added.length) {
						  const files = await uploadFiles(added)
						  remained.push(...files)
            }
            // 删除删除的图片
            if (deleted.length) {
						  await deleteFiles(deleted)
            }
            this.form.photos = remained
            console.log('formData', this.form)
            await this.updateRecord(this.id, this.form)
            this.$navigateTo('/nurturingToolbox/sleeping/sleeping')
          } else { // 新增
            // 上传图片
            if (this.photos.length) {
						  const files = await uploadFiles(this.photos)
						  this.form.photos = files
            }
            console.log('formData', this.form)
            const res = await addRecord(collection, this.form)
            console.log('submitForm', res)
            // this.$navigateTo('/nurturingToolbox/sleeping/detail?params=' + res.id)
            this.$navigateTo('/nurturingToolbox/sleeping/sleeping')
          }
        }
      })
    },
    resetForm () {
      this.form = {
        type: 0,
        startTime: '',
        endTime: '',
        duration: '',
        note: ''
      }
      this.form.duration = ''
      this.$refs.chooseMedia.clear()
    },
    cancel () {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="less" scoped>
	.sleeping {
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
