import { checkToken } from '@/service/auth'
import store from '@/store'

const getToken = () => store.state.token
const forcedLogin = () => store.state.forcedLogin

function getCurPage(){
	const pages = getCurrentPages() // eslint-disable-line
	const curPage = pages[pages.length-1]
	return curPage
}

function loginModal (title, content) {
	uni.showModal({
	  title: title || '您还未登录',
	  content: content || '请先登录后再继续',
	  cancelText: '暂不登录',
	  cancelColor: '#8F8F94',
	  confirmText: '立即登录',
	  confirmColor: '#3CC51F',
	  /**
			 * 如果需要强制登录，不显示取消按钮
			 */
	  showCancel: !forcedLogin(),
	  success: async (res) => {
	    if (res.confirm) {  
				const page = getCurPage()
				const path = page.route || ''
				const query = page.route ? page.options : {}
				const beforeRoute = {}
				if (path) {
					beforeRoute.path = path
					beforeRoute.query = query
				}
				// 记录登录前页面
				store.commit("beforeRoute", beforeRoute)
				/**
				 * 如果需要强制登录，使用reLaunch方式
				 */
				if (forcedLogin()) {
					uni.reLaunch({
						url: '/pages/auth/auth'
					})
				} else {
					uni.navigateTo({
						url: '/pages/auth/auth'
					})
				}
	    }
	  }
	})
}

// 检查用户登录状态，记录登录前页面
// 未登录，跳转到登录页
// TODO 登录后，跳转回登录前的页面
export async function loginCheck () {
	const token = getToken()
  if (!token) {
		loginModal()
  } else {
		// 检查token是否合法
		const res = await checkToken(token)
		console.log('checkToken', res)
		if (res.code === 30203) {
			loginModal('登录已过期', '登录已过期，请重新登录')
		} else if (res.code === 30204) {
			loginModal('非法令牌', '非法令牌，请重新登录')
		}
	}
}
