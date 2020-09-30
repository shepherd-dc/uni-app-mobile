import store from '@/store'

const token = () => store.state.token
const forcedLogin = () => store.state.forcedLogin

function getCurPage(){
	const pages = getCurrentPages() // eslint-disable-line
	const curPage = pages[pages.length-1]
	return curPage
}

// 检查用户登录状态，记录登录前页面
// 未登录，跳转到登录页
// TODO 登录后，跳转回登录前的页面
export function loginCheck () {
  if (!token()) {
		uni.showModal({
		  title: '您还未登录',
		  content: '请先登录后再继续',
		  cancelText: '暂不登录',
		  cancelColor: '#8F8F94',
		  confirmText: '立即登录',
		  confirmColor: '#3CC51F',
		  /**
				 * 如果需要强制登录，不显示取消按钮
				 */
		  showCancel: !forcedLogin(),
		  success: (res) => {
		    if (res.confirm) {  
					const page = getCurPage()
					const path = page.route || ''
					const query = page.route ? page.options : {}
					const beforeRoute = {}
					if (path) {
						beforeRoute.path = path
						beforeRoute.query = query
					}
					store.dispatch('logout', beforeRoute).then(() => {
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
					})
		    }
		  }
		})
  }
}
