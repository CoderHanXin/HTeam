<template>
  <div class="account-page">
    <div class="account-con">
      <div class="hd">
        <span>HTeam</span>
      </div>
      <div class="bd">
        <div class="form-box">
          <Form :model="user" :rules="rules" ref="signForm">
            <FormItem prop="name">
              <Input type="text" v-model.trim="user.name" :maxlength="20" size="large" :autofocus="true" placeholder="你的名字" />
            </FormItem>
            <FormItem prop="email">
              <Input type="email" v-model="user.email" :maxlength="50" size="large" placeholder="邮箱，例如：10086@10010.com" />
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="user.password" :maxlength="32" size="large" placeholder="密码，至少6位" />
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>注册</Button>
            </FormItem>
          </Form>
          <div>
            <span class="grey">已有账号？</span>
            <a @click="gotoLogin" class="link-text">直接登录 →</a>
          </div>
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
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.signForm.validate(valid => {
        if (valid) {
          userService.register(this.user.email, this.user.password, this.user.name).then(res => {
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
        this.$Message.info('注册成功')
        this.$router.replace({
          name: 'switch'
        })
      } else {
        this.$Message.error({
          content: res.data.message,
          duration: 3
        })
      }
    },
    gotoLogin() {
      this.$router.replace({
        name: 'login'
      })
    },
    ...mapMutations([
      'setCurrentUser',
      'setTeams'
    ])
  }
}
</script>

<style>

</style>
