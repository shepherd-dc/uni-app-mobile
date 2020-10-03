<template>
  <view class="content">
		<view class="userinfo" v-show="!hasLogin">
			<view class="userinfo-media" @tap="bindLogin">
				<img class="avatar" src="@/static/img/avatar.png"/>
				<span class="name">游客</span>
			</view>
			<view class="btn-row">
			  <button
			    type="primary"
			    class="primary"
			    @tap="bindLogin">登录</button>
			</view>
		</view>
		<view class="userinfo" v-if="hasLogin">
			<view class="userinfo-media">
				<open-data class="avatar" type="userAvatarUrl"></open-data>
				<open-data class="name" type="userNickName"></open-data>
			</view>
			<view class="btn-row">
			  <button
			    type="default"
			    @tap="bindLogout">退出登录</button>
			</view>
		</view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'

export default {
	onLoad () {
		loginCheck()
	},
  computed: {
    ...mapState(['hasLogin', 'forcedLogin'])
  },
  methods: {
    ...mapActions(['logout']),
    bindLogin () {
      uni.navigateTo({
        url: '../auth/auth'
      })
    },
    bindLogout () {
      this.logout()
      // 如果需要强制登录跳转回登录页面
      if (this.forcedLogin) {
        uni.reLaunch({
          url: '../auth/auth'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  text-align: center;
  &-media {
    background-color: #fff;
    padding: 50rpx 40rpx;
    display: flex;
    align-items: center;
    position: relative;
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 100%;
      margin-right: 35rpx;
    }
    .name {
      font-size: 32rpx;
    }
  }
}
</style>
