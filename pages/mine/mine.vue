<template>
  <view class="content">
    <view
      v-show="!hasLogin"
      class="userinfo">
      <view
        class="userinfo-media"
        @tap="bindLogin">
        <img
          class="avatar"
          src="@/static/img/avatar.png"/>
        <span class="name">游客</span>
      </view>
      <view class="btn-row">
        <button
          type="primary"
          class="primary"
          @tap="bindLogin">登录</button>
      </view>
    </view>
    <view
      v-if="hasLogin"
      class="userinfo">
      <view class="userinfo-media">
        <open-data
          class="avatar"
          type="userAvatarUrl"></open-data>
        <open-data
          class="name"
          type="userNickName"></open-data>
      </view>
			
			<view class="growth-point">
				<view class="flex point" @click="navigateToPage('point')">
					<text class="num">10</text>
					<text class="txt">积分</text>
				</view>
				<view class="flex like">
					<text class="num">100</text>
					<text class="txt">获赞</text>
				</view>
				<view class="flex growth" @click="navigateToPage('growth')">
					<text class="num">1500</text>
					<text class="txt">成长值</text>
				</view>
			</view>
			
			<uni-list>
				<uni-list-item class="member" title="我的会员卡" clickable link to="/pages/mine/card"></uni-list-item>
			</uni-list>
			
      <view class="btn-row">
        <button
          type="default"
          @tap="bindLogout">退出登录</button>
      </view>
    </view>
		<view class="btn-row">
			<button type="default" @click="test">账号登录测试</button>
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
	data() {
		return {
		}
	},
  computed: {
    ...mapState(['hasLogin', 'forcedLogin'])
  },
  methods: {
    ...mapActions(['logout']),
    bindLogin () {
      uni.navigateTo({
        url: '../user/auth'
      })
    },
    bindLogout () {
      this.logout()
      // 如果需要强制登录跳转回登录页面
      if (this.forcedLogin) {
        uni.reLaunch({
          url: '../user/auth'
        })
      }
    },
		test () {
			uni.navigateTo({
			  url: '../user/login'
			})
		},
		navigateToPage (p) {
			uni.navigateTo({
				url: `/pages/mine/${p}`
			})
		}
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  &-media {
    background-color: #fff;
    padding: 50rpx 40rpx;
    display: flex;
    align-items: center;
    position: relative;
		text-align: center;
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
.growth-point {
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	margin: 20rpx 0;
	padding: 30rpx 40rpx;
	.flex {
		display: flex;
		flex-direction: column;
		line-height: 50rpx;
		.num {
			font-size: 36rpx;
			font-weight: bold;
		}
		.txt {
			color: #999;
		}
	}
}
/deep/.member .uni-list-item__content-title {
	font-size: 32rpx;
}
</style>
