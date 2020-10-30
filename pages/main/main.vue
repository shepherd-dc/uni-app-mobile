<template>
  <view class="main">
    <!-- 自定义导航栏 -->
    <navbar></navbar>
    <!-- banner轮播图 -->
    <xc-banner></xc-banner>

    <view
      v-if="hasLogin"
      class="main-box">
      <view class="main-menus">
        <view class="card-header">
          <view class="header-item header-icon"></view>
          <text class="header-item header-title">养育工具箱</text>
        </view>
        <xc-menus
          :menus="menus"
          :wrap="false"
          @navigateTo="navigateTo" />
      </view>
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
import routesMap from '@/router/routes.map'

export default {
  onLoad () {
    loginCheck()
  },
  onShow () {
    if (this.hasLogin) this.queryMenus()
  },
  data () {
	  return {
	    menus: []
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
          routesMap.forEach(map => {
            if (map.name === item.en_name) {
              item.path = map.path
            }
          })
          return item
        })
      }
	  },
    navigateTo (item) {
      if (item.path) {
        this.$navigateTo(item.path)
      } else {
        this.$toast('开发中，敬请期待...')
      }
    }
  }
}
</script>

<style lang="less" scoped>
	.main {
		background-color: #FFFFFF;
		width: 100%;
		height: 100%;
	}
	.hello {
		color: #333;
		padding: 0 30rpx;
		.welcome {
			margin: 20rpx 0;
		}
	}
	.main-box {
		padding: 30rpx 0 0 20rpx;
		box-sizing: border-box;
	}
	.card-header {
		display: flex;
		padding-bottom: 10rpx;
		border-bottom: 2rpx solid #f8f8f8;
		margin-bottom: 20rpx;
		color: #333;
		.header-item {
			margin-right: 20rpx;
		}
		.header-icon {
			width: 8rpx;
			height: 40rpx;
			background-color: #56ceab;
		}
	}
</style>
