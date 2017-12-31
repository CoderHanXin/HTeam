<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form :model="form" :rules="rules" ref="loginForm">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$router.push({
            name: 'task'
          })
        }
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
.login
  width 100%
  height 100%
  background-image url('../../static/login_bg.jpg')
  background-size cover
  background-position center
  position relative
  &-con
    position absolute
    right 160px
    top 50%
    transform translateY(-60%)
    width 300px
    &-header
      font-size 16px
      font-weight 300
      text-align center
      padding 30px 0
    .form-con
      padding 10px 0 0
    .login-tip
      font-size 10px
      text-align center
      color #c3c3c3
</style>

