import Vue from 'vue'

// 封装 toast 提示框
Vue.prototype.$toast = (title, duration = 1500) => uni.showToast({
  icon: 'none',
  title,
  duration
})

// 封装路由跳转 navigateTo， switchTab，reLaunch
Vue.prototype.$router = (url) => uni.navigateTo({
  url: '/pages' + url,
  animationType: 'slide-in-left', // 跳转动画
  animationDuration: 800
})
// 跳转底部 tabbar 对应的页面
Vue.prototype.$switchTab = (url) => uni.switchTab({
  url: '/pages' + url
})
// 关闭其它页面，跳转
Vue.prototype.$relaunch = (url) => uni.reLaunch({
  url: '/pages' + url
})

// 封装 云函数请求
Vue.prototype.$uniCloud = async (name, data) => {
  uni.showLoading()
  try {
		const token = uni.getStorageSync('sn-token')
    const res = await uniCloud.callFunction({
      name, // 云函数名字
      data: Object.assign({}, data, { token }) // 传输数据
    })
    return res.result
  } catch (e) {
    return e
  } finally {
    uni.hideLoading()
  }
}
