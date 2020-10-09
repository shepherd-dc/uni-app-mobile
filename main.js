import Vue from 'vue'
import App from './App'

import store from './store'
import './utils/plugins'
import { db } from './utils/request'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$db = db

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()

export default app
