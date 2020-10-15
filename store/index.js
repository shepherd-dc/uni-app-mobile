import Vue from 'vue'
import Vuex from 'vuex'
import { logout } from '@/service/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 是否需要强制登录
		forcedLogin: false,
		hasLogin: uni.getStorageSync('uni_id_token') && uni.getStorageSync('uni_id_token_expired') > Date.now(),
		username: uni.getStorageSync('username'),
		birthday: uni.getStorageSync('birthday'),
		token: uni.getStorageSync('uni_id_token'),
		beforeRoute: {}
	},
	mutations: {
		saveLoginState (state, { username, token, tokenExpired }) {
			uni.setStorageSync('uni_id_token', token)
			uni.setStorageSync('uni_id_token_expired', tokenExpired)
			uni.setStorageSync('username', username)
			state.username = username || '新用户'
			state.token = token
			state.hasLogin = true
		},
		saveBabyInfo (state, birthday) {
			uni.setStorageSync('birthday', birthday)
			state.birthday = birthday || ''
		},
		beforeRoute(state, data) {
		  state.beforeRoute = data
		}
	},
	actions: {
		logout ({ state, commit }) {
			return new Promise(async (resolve, reject) => {
				try {
					if (state.token) await logout()
					uni.removeStorageSync('uni_id_token')
					uni.removeStorageSync('uni_id_token_expired')
					uni.removeStorageSync('username')
					state.username = ''
					state.token = ''
					state.hasLogin = false
					resolve()
				} catch (error) {
					reject(error)
				}
			})
		}
	}
})

export default store
