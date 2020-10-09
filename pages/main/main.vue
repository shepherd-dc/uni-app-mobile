<template>
  <view class="main">
    <view
      v-if="hasLogin"
      class="hello">
      <view class="menus">
        <xc-menus :menus="menus"></xc-menus>
      </view>
    </view>

    <view
      v-if="!hasLogin"
      class="hello">
      <view class="title">
        您好 游客。
      </view>
      <view class="ul">
        <view>这是 uni-app 带登录模板的示例App首页。</view>
        <view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'

export default {
  data () {
    return {
      menus: []
    }
  },
  computed: mapState(['forcedLogin', 'hasLogin', 'username']),
  onLoad () {
    loginCheck()
  },
  onShow () {
    if (this.hasLogin) this.queryMenus()
  },
  methods: {
	  async queryMenus () {
		  const { result } = await this.$db.collection('menus').where({ status: 0 }).get()
		  console.log(result.data)
      this.menus = result.data
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
</style>
