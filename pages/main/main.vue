<template>
  <view class="content">
    <view
      v-if="token"
      class="hello">
      <view class="menus">
        <menus></menus>
      </view>
    </view>

    <view
      v-if="!token"
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
import { uniClientDB, db } from '@/utils/request'
import { loginCheck } from '@/utils/loginCheck'

export default {
  computed: mapState(['forcedLogin', 'token', 'username']),
  onLoad () {
		loginCheck()
  },
	onShow () {
		if (this.token) this.queryMenus()
	},
  methods: {
	  async queryMenus () {
		  const res = await uniClientDB({
        name: 'menus',
		    command: db.collection('menus').get()
		  })
		  console.log(res)
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
