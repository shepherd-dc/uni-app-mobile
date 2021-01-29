<template>
  <view class="changeDiapers">
    <view class="form">
      <u-form
        ref="uForm"
        :label-width="180"
        :error-type="errorType"
        :model="form">
        <u-form-item
          label="换尿布时间"
          prop="startTime">
          <u-input
            v-model="form.startTime"
            :select-open="startTimeShow"
            type="select"
            placeholder="请选择换尿布时间"
            @click="startTimeShow = true" />
          <u-picker
            v-model="startTimeShow"
            :params="params"
            mode="time"
            confirm-color="#56ceab"
            @confirm="confirmStartTime"></u-picker>
        </u-form-item>
        <u-form-item
          label="嘘嘘颜色"
          prop="peeColor">
          <u-input
            v-model="form.peeColor"
            :select-open="peeColorShow"
            type="select"
            placeholder="请选择嘘嘘颜色"
            @click="peeColorShow = true" />
          <u-picker
            v-model="peeColorShow"
            :default-selector="[0]"
						:range="peeColorSelector"
            mode="selector"
            confirm-color="#56ceab"
            @confirm="confirmPeeColor"></u-picker>
        </u-form-item>
				<u-form-item
				  label="便便颜色"
				  prop="pooColor">
				  <u-input
				    v-model="form.pooColor"
				    :select-open="pooColorShow"
				    type="select"
				    placeholder="请选择便便颜色"
				    @click="pooColorShow = true" />
				  <u-picker
				    v-model="pooColorShow"
				    :default-selector="[0]"
						:range="pooColorSelector"
				    mode="selector"
				    confirm-color="#56ceab"
				    @confirm="confirmPooColor"></u-picker>
				</u-form-item>
				<u-form-item
				  label="便便质地"
				  prop="pooTexture">
				  <u-input
				    v-model="form.pooTexture"
				    :select-open="pooTextureShow"
				    type="select"
				    placeholder="请选择便便质地"
				    @click="pooTextureShow = true" />
				  <u-picker
				    v-model="pooTextureShow"
				    :default-selector="[0]"
						:range="pooTextureSelector"
				    mode="selector"
				    confirm-color="#56ceab"
				    @confirm="confirmPooTexture"></u-picker>
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
const { changeDiapers: { collection } } = toolboxConfig

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
        startTime: '',
        peeColor: '',
				pooColor: '',
				pooTexture: '',
        note: ''
      },
      errorType: ['toast'],
			peeColorSelector: [
				'正常', '乳白色', '粉色', '黄色', '浓茶色', '红色'
			],
			pooColorSelector: [
				'灰白色', '绿色', '黄褐色', '黑色',  '红色'
			],
			pooTextureSelector: [
				'一般', '干硬', '较干', '粘稠', '粘稠', '水样'
			],
      rules: {
        startTime: [
          {
            required: true,
            message: '请选择换尿布时间',
            trigger: ['blur', 'change']
          }
        ],
        peeColor: [
          {
            required: true,
            message: '请选择嘘嘘颜色',
            trigger: ['blur', 'change']
          }
        ],
				pooColor: [
				  {
				    required: true,
				    message: '请选择便便颜色',
				    trigger: ['blur', 'change']
				  }
				],
				pooTexture: [
				  {
				    required: true,
				    message: '请选择便便质地',
				    trigger: ['blur', 'change']
				  }
				]
      },
      startTimeShow: false,
      peeColorShow: false,
			pooColorShow: false,
			pooTextureShow: false,
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
			console.log('confirmStartTime', this.startTime)
      this.form.startTime = this.startTime
      
    },
    confirmPeeColor (e) {
			const [idx] = e
			const selected = this.peeColorSelector[idx]
			console.log('confirmPeeColor', selected)
      this.form.peeColor = selected
      
    },
		confirmPooColor (e) {
			const [idx] = e
			const selected = this.pooColorSelector[idx]
			console.log('confirmPooColor', selected)
			this.form.pooColor = selected
		},
		confirmPooTexture (e) {
			const [idx] = e
			const selected = this.pooTextureSelector[idx]
			console.log('confirmPooTexture', selected)
			this.form.pooTexture = selected
		},
    formatTime (e) {
      const { year, month, day, hour, minute } = e
      return `${year}-${month}-${day} ${hour}:${minute}`
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
        const { startTime, peeColor, pooColor, pooTexture, note, photos } = detail
        this.form.startTime = startTime
        this.form.peeColor = peeColor
        this.form.pooColor = pooColor
        this.form.pooTexture = pooTexture
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
            this.$navigateTo('/nurturingToolbox/changeDiapers/changeDiapers')
          } else { // 新增
            // 上传图片
            if (this.photos.length) {
						  const files = await uploadFiles(this.photos)
						  this.form.photos = files
            }
            console.log('formData', this.form)
            const res = await addRecord(collection, this.form)
            console.log('submitForm', res)
            // this.$navigateTo('/nurturingToolbox/changeDiapers/detail?params=' + res.id)
            this.$navigateTo('/nurturingToolbox/changeDiapers/changeDiapers')
          }
        }
      })
    },
    resetForm () {
      this.form = {
        startTime: '',
        peeColor: '',
				pooColor: '',
				pooTexture: '',
        note: ''
      }
      this.$refs.chooseMedia.clear()
    },
    cancel () {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="less" scoped>
	.changeDiapers {
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
