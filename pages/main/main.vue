<template>
  <view class="main">
    <!-- 自定义导航栏 -->
    <navbar></navbar>
    <!-- banner轮播图 -->
    <xc-banner></xc-banner>

    <view
      v-if="hasLogin"
      class="main-box">
      <view 
				class="main-menus"
				v-for="supmenu in supmenus"
				:key="supmenu._id">
        <view class="card-header">
          <view class="header-item header-icon"></view>
          <text class="header-item header-title">{{ supmenu.name }}</text>
        </view>
        <xc-menus
					v-if="supmenu.type === 'menu'"
          :menus="menus"
          :wrap="false"
          @navigateTo="navigateTo" />
				<video
					class="video-demo"
					v-if="supmenu.type === 'video'"
					poster="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7d442ec4-8edf-4e99-8e52-4170f0c2ac6c/b2570d14-7de5-455d-bec7-793338baeae4.jpg"
					src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7d442ec4-8edf-4e99-8e52-4170f0c2ac6c/3c160445-7dd1-495d-a360-ae0ef72e126d.mp4"
					controls />
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
import { getSupmenusList, getMenusList } from '@/service/menus'
import routesMap from '@/router/routes.map'

export default {
  onLoad () {
    loginCheck()
  },
  onShow () {
    if (this.hasLogin) {
			this.querySupmenus()
			this.queryMenus()
		}
  },
  data () {
	  return {
			supmenus: [],
	    menus: []
	  }
  },
  computed: mapState(['forcedLogin', 'hasLogin', 'username']),
  methods: {
		async querySupmenus () {
		  const res = await getSupmenusList()
		  console.log('getSupmenusList', res.data)
		  const { data } = res
		  if (data && data.length) {
		    this.supmenus = data
		  }
		},
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
	.main-menus {
		color: #333;
		margin-bottom: 40rpx;
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
	.video-demo {
		width: 640rpx;
		height: 427rpx;
	}
</style>
