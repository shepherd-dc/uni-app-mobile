<template>
  <view class="main">
    <view
      v-if="hasLogin"
      class="hello">
      <view class="menus">
        <xc-menus
					:menus="menus"
					@navigateTo="navigateTo" />
      </view>
			<uni-popup
				ref="popup"
				type="dialog" >
			    <uni-popup-dialog
						type="success"
						title="温馨提示"
						content="填写宝宝生日，以获得更贴心的服务"
						:before-close="true"
						@close="close"
						@confirm="confirm" >
					</uni-popup-dialog>
			</uni-popup>
    </view>

    <view
      v-if="!hasLogin"
      class="hello">
      <view class="welcome">
        您好，游客。
      </view>
      <view class="introduction">
        <view>欢迎来到「喜虫育儿」小程序。</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'
import { getMenusList } from '@/service/menus'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog'

export default {
	components: {
		uniPopupDialog
	},
  onLoad () {
    loginCheck()
  },
  onShow () {
    if (this.hasLogin) this.queryMenus()
  },
	data () {
	  return {
	    menus: [],
			routesMap: [
				{
					name: '疫苗',
					path: '/vaccine/vaccine'
				}
			]
	  }
	},
	computed: mapState(['forcedLogin', 'hasLogin', 'username']),
  methods: {
	  async queryMenus () {
			const res = await getMenusList()
			console.log('getMenusList', res.data)
			const { data } = res
			if (data && data.length) {
				this.menus = data.map(item => {
					this.routesMap.forEach(map => {
						if (map.name === item.name) {
							item.path = map.path
						}
					})
					return item
				})
			}
	  },
		navigateTo (item) {
			if (item.name === '疫苗') {
				this.$refs.popup.open()
			} else {
				this.$navigateTo(item.path)
			}
		},
		/**
		 * 点击取消按钮触发
		 * @param {Object} done
		 */
		close (done) {
			console.log('cancel')
			// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
			// ...
			done()
		},
		/**
		 * 点击确认按钮触发
		 * @param {Object} done
		 * @param {Object} value
		 */
		confirm (done) {
			this.$navigateTo('/info/info')
			done()
		}
  }
}
</script>

<style lang="less" scoped>
	.main {
		background-color: #FFFFFF;
		width: 100%;
		height: 100%;
		padding-top: 20rpx;
	}
	.hello {
		color: #333;
		padding: 0 30rpx;
		.welcome {
			margin: 20rpx 0;
		}
	}
	/deep/.uni-dialog-button-text.uni-button-color {
		color: #4cd964;
	}
</style>
