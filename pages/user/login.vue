<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input
          v-model="form.username"
          class="m-input"
          type="text"
          clearable
          focus
          placeholder="请输入账号"/>
      </view>
      <view class="input-row">
        <text class="title">密码：</text>
        <m-input
          v-model="form.password"
          type="password"
          displayable
          placeholder="请输入密码"/>
      </view>
    </view>
    <view class="btn-row">
      <button
        type="primary"
        class="primary"
        @tap="cloudLogin">登录</button>
    </view>
    <view class="action-row">
      <navigator url="./reg">注册账号</navigator>
      <text>|</text>
      <navigator url="./pwd">忘记密码</navigator>
    </view>
    <view
      v-if="hasProvider"
      :style="{top: positionTop + 'px'}"
      class="oauth-row">
      <view
        v-for="provider in providerList"
        :key="provider.value"
        class="oauth-image">
        <image
          :src="provider.image"
          @tap="oauth(provider.value)"/></image>
        <!-- #ifdef MP-WEIXIN -->
        <button
          v-if="!isDevtools"
          open-type="getUserInfo"
          @getuserinfo="getUserInfo"/>
          <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
// import service from '@/service/service.js'
import { mapState, mapMutations } from 'vuex'
import mInput from '@/components/m-input.vue'
import validate from '@/utils/validate.js'

export default {
  components: {
    mInput
  },
  data () {
    return {
      providerList: [],
      hasProvider: false,
      account: '',
      positionTop: 0,
      isDevtools: false,
      form: {
        username: '',
        password: '',
        openid: null
      },
      // 表单验证规则
      rules: {
        username: {
          rule: /\S/,
          msg: '账号不能为空'
        },
        password: {
          rule: /^[0-9a-zA-Z]{6,16}$/,
          msg: '密码应为6-16位'
        }
      }
    }
  },
  computed: mapState(['forcedLogin']),
  methods: {
    ...mapMutations(['saveLoginState']),
    initProvider () {
      const filters = ['weixin', 'qq', 'sinaweibo']
      uni.getProvider({
        service: 'oauth',
        success: (res) => {
          if (res.provider && res.provider.length) {
            for (let i = 0; i < res.provider.length; i++) {
              if (~filters.indexOf(res.provider[i])) {
                this.providerList.push({
                  value: res.provider[i],
                  image: '../../static/img/' + res.provider[i] + '.png'
                })
              }
            }
            this.hasProvider = true
          }
        },
        fail: (err) => {
          console.error('获取服务供应商失败：' + JSON.stringify(err))
        }
      })
    },
    initPosition () {
      /**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
      this.positionTop = uni.getSystemInfoSync().windowHeight - 100
    },
    async cloudLogin () {
      if (!this.form.openid) {
			  // 不是微信登录，验证表单是否合法
        if (!validate('username', this.rules, this.form)) return
        if (!validate('password', this.rules, this.form)) return
      } else {
        this.form.username = ''
        this.form.password = ''
      }
      const data = Object.assign({}, this.form, { type: 'login' })
      const res = await this.$uniCloud('user', data)
      if (res.code === 0) {
        const { data } = res
        if (data.username) this.account = data.username
        this.$toast('登陆成功')
        this.toMain(this.account, data.token)
      } else {
        this.$toast(res.msg)
      }
    },
    getTempCode (value) {
      return new Promise((reslove, reject) => {
        uni.login({
          provider: value,
          success: (res) => {
            reslove(res.code)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    uniGetUserInfo (value) {
      return new Promise((reslove, reject) => {
        uni.getUserInfo({
          provider: value,
          success: (res) => {
            if (res.userInfo) {
              reslove(res.userInfo)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    async getOpenId (value) {
      const jscode = await this.getTempCode(value)
      const { data } = await this.$uniCloud('loginByWechat', {
        js_code: jscode
      })
      return data.openid
    },
    async oauth (value) {
      this.form.openid = await this.getOpenId(value)
      const userInfo = await this.uniGetUserInfo(value)
      this.account = userInfo.nickName
      this.cloudLogin()
    },
    async getUserInfo ({ detail }) {
      this.form.openid = await this.getOpenId('weixin')
      if (detail.userInfo) {
        this.account = detail.userInfo.nickName
        this.cloudLogin()
      } else {
        this.$toast('登录失败')
      }
    },
    uniSetStorage (token) {
      try {
			   uni.setStorageSync('sn-token', token)
      } catch (e) {
			  this.$toast(e)
      }
    },
    toMain (username, token) {
      this.saveLoginState({ username, token })
      this.uniSetStorage(token)
      /**
			 * 强制登录时使用reLaunch方式跳转过来
			 * 返回首页也使用reLaunch方式
			 */
      if (this.forcedLogin) {
        uni.reLaunch({
          url: '../main/main'
        })
      } else {
        uni.navigateBack()
      }
    }
  },
  onReady () {
    this.initPosition()
    this.initProvider()
    // #ifdef MP-WEIXIN
    this.isDevtools = uni.getSystemInfoSync().platform === 'devtools'
    // #endif
  }
}
</script>

<style lang="less" scoped>
	.btn-row button {
		margin-bottom: 10px;
	}
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		position: relative;
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 30px;
		height: 30px;
		margin: 10px;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
