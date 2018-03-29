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
            <FormItem prop="email">
              <Input type="email" v-model="user.email" :autofocus="true" placeholder="请输入邮箱">
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
          <div>
            <span class="grey">没有账号？</span>
            <a @click="gotoRegister" class="link-text">立即注册 →</a>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import userService from '@/api/services/user'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.checkToken()
  },
  methods: {
    checkToken() {
      let token = Cookies.get('token')
      if (token) {
        userService.show().then(res => {
          this.init(res)
        })
      }
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          userService.login(this.user.email, this.user.password).then(res => {
            this.init(res)
          })
        }
      })
    },
    init(res) {
      if (res.data.code === 0) {
        if (res.data.data.token) {
          Cookies.set('token', res.data.data.token, { expires: 14 })
        }
        const user = res.data.data.user
        Cookies.set('currentUser', user)
        Cookies.set('teams', user.teams)
        this.setCurrentUser(user)
        this.setTeams(user.teams)
        this.$Message.info('登录成功')
        const teamCount = user.teams.length
        if (teamCount === 1) {
          Cookies.set('currentTeam', user.teams[0])
          this.setCurrentTeam(user.teams[0])
          this.$router.replace({
            name: 'project'
          })
        } else {
          // 选择团队或者创建新团队
          this.$router.replace({
            name: 'switch'
          })
        }
      } else {
        this.$Message.error({
          content: res.data.message,
          duration: 3
        })
      }
    },
    gotoRegister() {
      this.$router.push({
        name: 'register'
      })
    },
    ...mapMutations([
      'setCurrentUser',
      'setCurrentTeam',
      'setTeams'
    ])
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
      font-size 12px
      text-align center
    .login-tip
      font-size $font-size-small-s
      text-align center
      color #c3c3c3
</style>
