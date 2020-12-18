import callCloudFunction from '@/utils/request'

// 删除云存储文件是一个高危操作，应该由云函数进行权限校验后由云函数来删除云存储的文件
// 阿里云禁止客户端删除云存储文件
export async function deleteFiles (fileList) {
	return await callCloudFunction('deleteFiles', {
		fileList
	})
}

export default async function uploadFiles (fileList) {
	if (!fileList.length) return
	const cloudFileList = []
	uni.showLoading({
		title: '图片上传中',
		mask: true
	})
	try {
		// 多文件上传, 循环调用API
		for (let i = 0; i < fileList.length; i++) {
			const filePath = fileList[i]
			const cloudPath = fileList[i].split('/').slice(-1)[0].substr(-32)
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
			cloudFileList.push(file.fileID)
		}
	} catch (e) {
		console.error(e) // eslint-disable-line
		uni.showModal({
			content: e.message || '服务器异常，请稍后再试',
			showCancel: false
		})
	} finally {
		if (cloudFileList.length === fileList.length) {
			uni.showToast({
				title: '全部上传成功！',
				icon: 'none'
			})
		}
		uni.hideLoading()
	}
	return cloudFileList
}
