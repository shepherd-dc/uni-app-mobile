<template>
  <view class="content">
    <view
      v-if="hasLogin"
      class="hello">
      <view class="menus">
        <menus></menus>
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
  computed: mapState(['forcedLogin', 'hasLogin', 'username']),
  onLoad () {
		loginCheck()
  },
	onShow () {
		if (this.hasLogin) this.queryMenus()
	},
  methods: {
	  async queryMenus () {
		  const { result } = await this.$db.collection('menus').get()
		  console.log(result.data)
	  }
  }
}
</script>

<style>
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul {
		font-size: 15px;
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul>view {
		line-height: 25px;
	}
</style>
