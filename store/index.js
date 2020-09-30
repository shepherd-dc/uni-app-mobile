import Vue from 'vue'
import Vuex from 'vuex'
import { logout } from '@/api/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 是否需要强制登录
		forcedLogin: false,
		hasLogin: false,
		username: '',
		token: uni.getStorageSync('uni_id_token'),
		beforeRoute: {}
	},
	mutations: {
		saveLoginState (state, { username, token }) {
			state.username = username || '新用户'
			state.token = token
			state.hasLogin = true
		},
		beforeRoute(state, data) {
		  state.beforeRoute = data
		}
	},
	actions: {
		logout ({ state, commit }, beforeRoute) {
			return new Promise(async (resolve, reject) => {
				try {
					if (state.token) await logout()
					state.username = ''
					state.token = ''
					state.hasLogin = false
					uni.removeStorageSync('uni_id_token')
					// 记录登录前页面
					if (beforeRoute) {
					  commit("beforeRoute", beforeRoute)
					}
					resolve()
				} catch (error) {
					reject(error)
				}
			})
		}
	}
})

export default store
