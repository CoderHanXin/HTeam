<template>
  <div class="account-page">
    <div class="account-con">
      <div class="hd">
        <span class="logo" @click="gotoLogin">HTeam</span>
      </div>
      <div class="bd">
        <div v-if="success" class="form-box">
          <div class="form-title">
            <span>加入「{{team.name}}」</span>
          </div>
          <Form :model="user" :rules="rules" ref="signForm">
            <FormItem v-if="user.status === 0" prop="name">
              <Input type="text" v-model.trim="user.name" :maxlength="20" size="large" :autofocus="true" placeholder="你的名字" />
            </FormItem>
            <FormItem prop="email">
              <Input type="email" v-model="user.email" size="large" disabled />
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="user.password" :maxlength="32" size="large" :placeholder="passwordHolder" />
            </FormItem>
            <FormItem>
              <Button v-if="user.status === 0" @click="handleRegister" type="primary" long>注册</Button>
              <Button v-else @click="handleLogin" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
        <div v-else class="error-message">
          {{errorMessage}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import userService from '@/api/services/user'
import { mapMutations } from 'vuex'
export default {
  name: 'Join',
  data() {
    return {
      ticket: '',
      success: false,
      errorMessage: '',
      user: {},
      team: {},
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    passwordHolder() {
      return this.user.status === 0 ? '密码，至少6位' : '密码'
    }
  },
  created() {
    this.ticket = this.$route.params.ticket
    this.checkTicket()
  },
  methods: {
    checkTicket() {
      userService.joinCheck(this.ticket).then(res => {
        if (res.data.code === 0) {
          this.success = true
          this.user = res.data.data.user
          this.team = res.data.data.team
        } else {
          this.success = false
          this.errorMessage = res.data.message
        }
      })
    },
    handleLogin() {
      userService.join(this.user.email, this.user.password, this.team.id, null).then(res => {
        if (res.data.code === 0) {
          this.login()
        } else {
          this.$Message.error({
            content: res.data.message,
            duration: 3
          })
        }
      })
    },
    handleRegister() {
      userService.join(this.user.email, this.user.password, this.team.id, this.user.name).then(res => {
        if (res.data.code === 0) {
          this.login()
        }
      })
    },
    login() {
      userService.login(this.user.email, this.user.password).then(res => {
        this.init(res)
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
        let currentTeam = user.teams.find(val => {
          return val.id === this.team.id
        })
        Cookies.set('currentTeam', currentTeam)
        this.setCurrentTeam(currentTeam)
        this.$router.replace({
          name: 'project'
        })
      } else {
        this.$Message.error({
          content: res.data.message,
          duration: 3
        })
      }
    },
    gotoLogin() {
      Cookies.remove('token')
      this.$router.push({
        name: 'login'
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

.logo
  cursor pointer
.form-title
  margin-bottom 16px
  font-size 20px
  color $color-grey
.error-message
  font-size 20px
</style>

