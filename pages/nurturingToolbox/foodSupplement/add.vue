<template>
  <view class="foodSupplement">
    <view class="form">
      <u-form
        ref="uForm"
        :label-width="180"
        :error-type="errorType"
        :model="form">
        <u-form-item
          label="时间"
          prop="feedingTime">
          <u-input
            v-model="form.feedingTime"
            :select-open="feedingTimeShow"
            type="select"
            placeholder="请选择时间"
            @click="feedingTimeShow = true" />
          <u-picker
            v-model="feedingTimeShow"
            :params="params"
            mode="time"
            confirm-color="#56ceab"
            @confirm="confirmFeedingTime"></u-picker>
        </u-form-item>
        <u-form-item
          label="食材"
          prop="ingredients">
          <u-input
            v-model="form.ingredients"
						:clearable="false"
            type="textarea"
						height="80px"
						auto-height
            placeholder="请输入食材" />
        </u-form-item>
        <u-form-item :border-bottom="false">
          <view>随手记</view>
          <u-input
            v-model="form.note"
            :clearable="false"
            class="custom-input"
						height="160px"
            auto-height
            placeholder="记录食物名称以及宝宝食量，方便了解宝宝营养，帮助宝宝排查过敏原"
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
const { foodSupplement: { collection } } = toolboxConfig

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
        feedingTime: '',
        ingredients: '',
        note: ''
      },
      errorType: ['toast'],
      rules: {
        feedingTime: [
          {
            required: true,
            message: '请选择时间',
            trigger: ['blur', 'change']
          }
        ],
        ingredients: [
				  {
				    required: true,
				    message: '请输入食材',
				    trigger: ['blur', 'change']
				  }
        ]
      },
      feedingTimeShow: false,
      feedingTime: '',
      ingredients: '',
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
    confirmFeedingTime (e) {
      this.feedingTime = this.formatTime(e)
			console.log('confirmFeedingTime', this.feedingTime)
      this.form.feedingTime = this.feedingTime
      
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
        const { feedingTime, ingredients, note, photos } = detail
        this.form.feedingTime = feedingTime
        this.form.ingredients = ingredients
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
            this.$navigateTo('/nurturingToolbox/foodSupplement/foodSupplement')
          } else { // 新增
            // 上传图片
            if (this.photos.length) {
						  const files = await uploadFiles(this.photos)
						  this.form.photos = files
            }
            console.log('formData', this.form)
            const res = await addRecord(collection, this.form)
            console.log('submitForm', res)
            // this.$navigateTo('/nurturingToolbox/foodSupplement/detail?params=' + res.id)
            this.$navigateTo('/nurturingToolbox/foodSupplement/foodSupplement')
          }
        }
      })
    },
    resetForm () {
      this.form = {
        feedingTime: '',
        ingredients: '',
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
	.foodSupplement {
		width: 100%;
		padding: 0 30rpx;
	}
	.form {
		margin-bottom: 40rpx;
	}
	/deep/ .custom-input textarea {
		min-height: 70rpx!important;
		color: #666;
	}
</style>
