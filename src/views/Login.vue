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
import { mapActions } from 'vuex'
import Cookies from 'js-cookie'
import url from '../api/url'
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
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$http.post(url.user_login, this.user).then(res => {
            if (res.data.code === 0) {
              Cookies.set('username', this.user.username, { expires: 30 })
              Cookies.set('password', this.user.password, { expires: 30 })
              Cookies.set('currentUser', res.data.data)
              this.setCurrentUser(res.data.data)
              this.$Message.info('登录成功')
              const teamCount = res.data.data.teams.length
              if (teamCount === 1) {
                Cookies.set('currentTeam', res.data.data.teams[0])
                this.$router.replace({
                  name: 'task-my'
                })
              } else if (teamCount > 1) {
                // 大于一个团队，需要选择团队
              } else {
                // 没有团队
              }
            } else {
              this.$Message.error({
                content: res.data.message,
                duration: 3
              })
            }
          })
        }
      })
    },
    ...mapActions(['setCurrentUser'])
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
