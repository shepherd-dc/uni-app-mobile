<template>
  <view class="content">
    <view class="input-group">
      <view class="input-row border">
        <text class="title">账号：</text>
        <m-input
          v-model="form.username"
          type="text"
          focus
          clearable
          placeholder="请输入账号"></m-input>
      </view>
      <view class="input-row border">
        <text class="title">密码：</text>
        <m-input
          v-model="form.password"
          type="password"
          displayable
          placeholder="请输入密码"></m-input>
      </view>
      <view class="input-row">
        <text class="title">邮箱：</text>
        <m-input
          v-model="form.email"
          type="text"
          clearable
          placeholder="请输入邮箱"></m-input>
      </view>
    </view>
    <view class="btn-row">
      <button
        type="primary"
        class="primary"
        @tap="register">注册</button>
    </view>
  </view>
</template>

<script>
// import service from '@/service/service.js'
import validate from '@/utils/validate.js'
import mInput from '@/components/m-input.vue'

export default {
  components: {
    mInput
  },
  data () {
    return {
      form: {
        username: '',
        password: '',
        email: ''
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
			  },
        email: {
          rule: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          msg: '邮箱格式不正确'
        }
      }
    }
  },
  methods: {
    async register () {
      if (!validate('username', this.rules, this.form)) return
      if (!validate('password', this.rules, this.form)) return
      if (!validate('email', this.rules, this.form)) return
      // service.addUser(this.form)
      const data = Object.assign({}, this.form, { type: 'add' })
      const res = await this.$uniCloud('user', data)
			console.log(res)
      if (res.code === 0) {
        this.$toast('注册成功，请登录')
        // 跳转
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          })
        }, 1500)
      } else {
        this.$toast(res.msg)
      }
    }
  }
}
</script>

<style>

</style>
