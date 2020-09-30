import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 是否需要强制登录
		forcedLogin: false,
		hasLogin: false,
		username: '',
		token: uni.getStorageSync('uni_id_token')
	},
	mutations: {
		saveLoginState (state, { username, token }) {
			state.username = username || '新用户'
			state.token = token
			state.hasLogin = true
		},
		logout (state) {
			state.username = ''
			state.token = ''
			state.hasLogin = false
		}
	}
})

export default store
