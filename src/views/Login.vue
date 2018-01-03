<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form :model="user" :rules="rules" ref="loginForm">
            <FormItem prop="username">
              <Input v-model="user.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="user.password" placeholder="请输入密码">
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
      user: {
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
          this.$http.post('/api/user/login', this.user)
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.info('登录成功')
                this.$router.push({
                  name: 'task'
                })
              } else {
                this.$Message.error({
                  content: res.data.message,
                  duration: 3
                })
              }
            })
        }
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
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
    .form-con
      padding 8px 0 0
    .login-tip
      font-size $font-size-small-s
      text-align center
      color #c3c3c3
</style>

