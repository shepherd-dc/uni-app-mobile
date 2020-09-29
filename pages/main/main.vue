<template>
  <view class="content">
    <view
      v-if="hasLogin"
      class="hello">
      <view class="title">
        您好 {{ username }}，您已成功登录。
      </view>
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

export default {
  computed: mapState(['forcedLogin', 'hasLogin', 'username']),
  onLoad () {
    if (!this.hasLogin) {
      uni.showModal({
        title: '您还未登录',
        content: '请先登录后再继续',
				cancelText: '暂不登录',
				cancelColor: '#8F8F94',
				confirmText: '立即登录',
				confirmColor: '#3CC51F',
        /**
					 * 如果需要强制登录，不显示取消按钮
					 */
        showCancel: !this.forcedLogin,
        success: (res) => {
          if (res.confirm) {
            /**
							 * 如果需要强制登录，使用reLaunch方式
							 */
            if (this.forcedLogin) {
              uni.reLaunch({
                url: '../auth/auth'
              })
            } else {
              uni.navigateTo({
                url: '../auth/auth'
              })
            }
          }
        }
      })
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
