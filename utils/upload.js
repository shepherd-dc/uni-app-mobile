import callCloudFunction from '@/utils/request'

export async function deleteFiles (fileList) {
	return await callCloudFunction('deleteFiles', {
		fileList
	})
}

async function uploadFiles (imgList) {
	if (!imgList.length) return
	const cloudImgList = []
	uni.showLoading({
		title: '图片上传中',
		mask: true
	})
	try {
		// 多文件上传, 循环调用API
		for (let i = 0; i < imgList.length; i++) {
			const filePath = imgList[i].tempFilePath
			const cloudPath = imgList[i].tempFilePath.split('/').slice(-1)[0].substr(-32)
			const file = await uniCloud.uploadFile({
				filePath,
				cloudPath,
				// onUploadProgress: (progressEvent) => {
				// 	const percentCompleted = Math.round(
				// 		(progressEvent.loaded * 100) / progressEvent.total
				// 	)
					// console.log(percentCompleted) // eslint-disable-line
				// }
			})
			cloudImgList.push(file.fileID)
		}
	} catch (e) {
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	} finally {
		if (cloudImgList.length === imgList.length) {
			uni.hideLoading()
			uni.showToast({
				title: '全部上传成功！',
				icon: 'none'
			})
		}
	}
	return cloudImgList
}

export default uploadFiles
