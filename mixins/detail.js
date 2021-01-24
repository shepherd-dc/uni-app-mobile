export default {
	onLoad (opt) {
	  console.log(opt)
	  this.id = opt.params
	  // 设置 shareTicket
	  uni.showShareMenu({
		  withShareTicket: true
	  })
	},
	// 设置 发送给朋友
	onShareAppMessage (res) {
	  // 用户点击分享卡片后可获取的query参数
	  return {
	    title: '母乳亲喂记录',
	    path: `pages/nurturingToolbox/breastfeeding/detail?params=${this.id}`
	  }
	},
	// 设置 分享到朋友圈
	onShareTimeline (res) {
	  return {
		  title: '母乳亲喂记录',
		  query: `params=${this.id}`,
	    imageUrl: '/static/img/logo.jpg'
	  }
	},
	data () {
		return {
			id: ''
		}
	}
} 