const uniID = async (action, params = {}) => {
  uni.showLoading()
  try {
		// const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name: 'user-center',
			data: {
				action,
				params
			},
    })
    return res.result
  } catch (e) {
    console.error(e) // eslint-disable-line
    uni.showModal({
    	content: e.message || '云函数请求失败',
    	showCancel: false
    })
  } finally {
    uni.hideLoading()
  }
}

export default async (name, data) => {
  uni.showLoading()
  try {
		// const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name, // 云函数名字
			// data: Object.assign({}, data, { token }) // 传输数据
			data
    })
    return res.result
  } catch (e) {
    console.error(e) // eslint-disable-line
    uni.showModal({
    	content: e.message || '云函数请求失败',
    	showCancel: false
    })
  } finally {
    uni.hideLoading()
  }
}

export {
	uniID
}
