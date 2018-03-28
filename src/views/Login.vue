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
              <Input v-model="user.email" :autofocus="true" placeholder="请输入邮箱">
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
          {
            type: 'string',
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9_]+\.)+[a-zA-Z]{2,}))$/gi,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
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
        this.setCurrentUser(user)
        this.$Message.info('登录成功')
        const teamCount = user.teams.length
        if (teamCount === 1) {
          Cookies.set('currentTeam', user.teams[0])
          this.setCurrentTeam(user.teams[0])
          this.$router.replace({
            name: 'project'
          })
        } else if (teamCount > 1) {
          // 大于一个团队，需要选择团队
          // todo 暂时直接选择第一个团队进入
          Cookies.set('currentTeam', user.teams[0])
          this.setCurrentTeam(user.teams[0])
          this.$router.replace({
            name: 'project'
          })
        } else {
          // 没有团队 todo
        }
      } else {
        this.$Message.error({
          content: res.data.message,
          duration: 3
        })
      }
    },
    ...mapMutations([
      'setCurrentUser',
      'setCurrentTeam'
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
    .login-tip
      font-size $font-size-small-s
      text-align center
      color #c3c3c3
</style>
