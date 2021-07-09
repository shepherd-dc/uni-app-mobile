<template>
	<view class="ugc-publish">
		<view class="btn-group">
		  <text
		    class="custom-btn"
		    @click="cancel">取消</text>
		  <u-button
				class="custom-btn"
		    type="success"
				size="mini"
		    @click="publish">发表</u-button>
		</view>
		<view class="form">
		  <u-form
		    ref="uForm"
		    :error-type="errorType"
		    :model="form">
		    <u-form-item :border-bottom="false">
		      <u-input
		        v-model="form.content"
		        :clearable="false"
		        class="custom-input"
						height="80px"
		        auto-height
		        placeholder="说说此刻的想法..."
		        type="textarea" />
		    </u-form-item>
		    <xc-media-upload
		      ref="chooseMedia"
		      :images="images"
		      @change="handleChosenChange" />
		  </u-form>
		</view>
	</view>
</template>

<script>
	import userInfoMixin from '@/mixins/userInfo'
	import NoteService from '@/service/NoteService'
	export default {
		mixins: [
			userInfoMixin
		],
		data() {
			return {
				form: {
				  content: ''
				},
				errorType: ['toast'],
				images: []
			}
		},
		methods: {
			handleChosenChange (images) {
			  this.images = images
			  console.log('this.images', this.images)
			},
			async publish () {
				const formData = Object.assign({ openid: this.openid }, this.form)
				const noteService = new NoteService()
				const result = await noteService.postNote(formData, this.images)
				console.log('postNote', result)
				if (result && result.code === 0) {
					uni.switchTab({
						url: '/pages/community/community'
					})
				}
			},
			cancel () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less" scoped>
	.ugc-publish {
		width: 100%;
		padding: 30rpx;
	}
	.btn-group {
		display: flex;
		justify-content: space-between;
		.custom-btn {
			font-size: 28rpx;
			/deep/.u-size-mini {
				font-size: 26rpx;
			}
		}
	}
</style>
