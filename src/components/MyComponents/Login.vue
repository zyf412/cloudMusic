<template>
  <div>
    <el-form :model="loginForm"  size="mini" ref="loginFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="loginForm.phone"></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password"  v-show="loginType">
        <el-input v-model="loginForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="动态短信" prop="captcha"  v-show="!loginType">
        <el-input v-model="loginForm.captcha" show-password></el-input>
      </el-form-item>

      <!-- <el-button type="primary" size="mini" @click="getCaptcha">已发送验证码</el-button> -->
    <el-form-item v-show="!loginType">
       <el-button type="primary" size="mini" @click="getCaptcha" >获取验证码</el-button>
    <el-button type="primary" size="mini" @click="submitForm">登录</el-button>
  </el-form-item>
   <el-form-item v-show="loginType">
    <el-button type="primary" size="mini" @click="pwdLogin">登录</el-button>
  </el-form-item>
    </el-form>
    <div class="loginType">
      <div v-show="loginType" @click="loginType = !loginType"> 短信登录</div>
      <div v-show="!loginType"  @click="loginType = !loginType"> 密码登录</div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    return {
      loginForm: {
        phone: '',
        password: '',
        captcha: ''
      },
      loginType: true
    //   ,
    //   loginRules: {
    //     captcha: [
    //       { required: true, message: '请输入活动名称', trigger: 'blur' },
    //       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    //     ]
    //   }
    }
  },
  methods: {
    // 获取短信验证码
    async getCaptcha () {
      const { data: res } = await this.$http.get('/captcha/sent',
        { params: { phone: this.loginForm.phone } })
      console.log('获取验证码')
      console.log(res)
      if (res.code !== 200) return this.$message.error(res.message)
    },
    // 检验 短信验证码
    async submitForm (loginForm) {
      const { data: res } = await this.$http.get('/captcha/verify',
        {
          params: {
            phone: loginForm.phone,
            captcha: loginForm.captcha
          }
        })
      console.log('检验 验证码')
      console.log(res)
      if (res.code !== 200) return this.$message.error(res.message)
      this.Login(loginForm)
    },
    // 短信方式登录
    async Login (loginForm) {
      const { data: res } = await this.$http.get('/login/cellphone',
        {
          params: {
            phone: loginForm.phone,
            captcha: loginForm.captcha
          },
          withCredentials: true
        })
      console.log('登录完成')
      console.log(res)
      if (res.code !== 200) return this.$message.error('登录失败')
      // document.cookie = res.cookie
      this.reload()
      this.getAccount()
    },
    // 普通手机密码登录
    async pwdLogin () {
      const { data: res } = await this.$http.get('/login/cellphone',
        {
          params: {
            phone: this.loginForm.phone,
            password: this.loginForm.password
          },
          withCredentials: true
        })
      console.log('普通密码登录完成')
      console.log(res)
      if (res.code !== 200) {
        if (res.message) return this.$message.error(res.message)
        else return this.$message.error('登录失败')
      }
      // document.cookie = res.cookie
      this.reload()
      this.getAccount()
    },
    // 获取账户信息
    async getAccount () {
      const { data: res } = await this.$http.get('/user/account', {
        withCredentials: true
        // params: {
        //   time: Number(new Date())
        // }
      })
      console.log('获取账号信息')
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取账号信息失败')
      this.$emit('getUserInfo', res.profile)
    }
  }
}
</script>

<style>
</style>
