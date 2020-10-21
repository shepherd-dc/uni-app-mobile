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

export default {
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
      this.$navigateTo(item.path)
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
</style>
