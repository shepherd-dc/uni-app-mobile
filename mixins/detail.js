import toolboxConfig from '@/config/toolbox'

export default {
	onLoad (opt) {
	  console.log(opt) // eslint-disable-line
	  this.id = opt.params
	  this.module = opt.module
	  // 设置 shareTicket
	  uni.showShareMenu({
		  withShareTicket: true
	  })
	},
	// 设置 发送给朋友
	onShareAppMessage (res) {
	  // 用户点击分享卡片后可获取的query参数
	  return {
	    title: toolboxConfig[this.module].title,
	    path: `pages/nurturingToolbox/${this.module}/detail?params=${this.id}`
	  }
	},
	// 设置 分享到朋友圈
	onShareTimeline (res) {
	  return {
		  title: toolboxConfig[this.module].title,
		  query: `params=${this.id}`,
	    imageUrl: '/static/img/logo.jpg'
	  }
	},
	data () {
		return {
			id: '',
			module: ''
		}
	}
} 