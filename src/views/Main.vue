<template>
  <div class="layout">
    <MainSider :activeName="mainRoute" @on-select="handleChangeMenu">
      <MainSiderItem name="task">
        <Icon class="icon" size="18" type="ios-checkmark"></Icon>
        <p>任务</p>
      </MainSiderItem>
      <MainSiderItem name="project">
        <Icon size="18" type="ios-navigate"></Icon>
        <p>项目</p>
      </MainSiderItem>
      <MainSiderItem name="team">
        <Icon size="18" type="ios-clock"></Icon>
        <p>团队</p>
      </MainSiderItem>
    </MainSider>
    <Layout>
      <router-view></router-view>
    </Layout>
    <div class="avatar" @click="togglePopMenu">
      <Avatar size="large">{{avatarName}}</Avatar>
    </div>
    <div class="pop-box" v-clickoutside="handlePopMenuClose" :style="popMenuStyle">
      <ul class="pop-menu">
        <li class="pop-menu-item" @click="gotoAccount">个人中心</li>
        <li class="pop-menu-item" @click="showEditPass">修改密码</li>
        <li class="pop-menu-item" @click="logout">退出</li>
      </ul>
    </div>
    <Modal v-model="editPasswordModal" :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="changePasswordForm" :model="changePassword" :rules="rules" :label-width="80">
        <FormItem label="原密码" prop="oldPass" :error="oldPassError">
          <Input type="password" v-model="changePassword.oldPass" :maxlength="32" placeholder="请输入现在使用的密码" />
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input type="password" v-model="changePassword.newPass" :maxlength="32" placeholder="请输入新密码，至少6位字符" />
        </FormItem>
        <FormItem label="确认密码" prop="rePass">
          <Input type="password" v-model="changePassword.rePass" :maxlength="32" placeholder="请再次输入新密码" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import url from '@/api/url'
import clickoutside from '@/directives/clickoutside'
import MainSider from '@/views/components/sider/MainSider'
import MainSiderItem from '@/views/components/sider/MainSiderItem'
export default {
  name: 'Main',
  components: {
    MainSider,
    MainSiderItem
  },
  directives: { clickoutside },
  props: {
    beforePush: {
      type: Function
    }
  },
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.changePassword.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      currentUser: {},
      popMenuVisable: false,
      isToggle: false,
      saveLoading: false,
      editPasswordModal: false,
      oldPassError: '',
      changePassword: {
        oldPass: '',
        newPass: '',
        rePass: ''
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        rePass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: valideRePassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    mainRoute() {
      let main = this.$route.name.split('-')
      return main && main[0]
    },
    avatarName() {
      return this.currentUser.name.substr(-2)
    },
    popMenuStyle() {
      if (!this.popMenuVisable) {
        return {
          display: 'none'
        }
      }
    }
  },
  created() {
    this.currentUser = Cookies.getJSON('currentUser')
  },
  methods: {
    handleChangeMenu(name) {
      let willpush = true
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false
        }
      }
      if (willpush) {
        this.$router.push({
          name: name
        })
      }
    },
    togglePopMenu() {
      this.isToggle = true
      this.popMenuVisable = !this.popMenuVisable
    },
    handlePopMenuClose() {
      if (this.isToggle) {
        this.isToggle = false
      } else {
        if (this.popMenuVisable) {
          this.popMenuVisable = false
        }
      }
    },
    gotoAccount() {
      this.$router.push({
        name: 'profile'
      })
      this.popMenuVisable = false
    },
    showEditPass() {
      this.editPasswordModal = true
      this.popMenuVisable = false
    },
    saveEditPass() {
      this.$refs.changePasswordForm.validate(valid => {
        if (valid) {
          this.saveLoading = true
          let params = {}
          params.id = this.currentUser.id
          params.oldPass = this.changePassword.oldPass
          params.newPass = this.changePassword.newPass
          params.rePass = this.changePassword.rePass
          this.$http
            .put(url.user_change_password, params)
            .then(res => {
              if (res.data.code === 0) {
                this.saveLoading = false
                this.editPasswordModal = false
                this.$Message.success('操作成功')
              } else {
                this.oldPassError = res.data.message
              }
            })
        }
      })
    },
    cancelEditPass() {
      this.editPasswordModal = false
    },
    logout() {
      this.popMenuVisable = false
    }
  }
}
</script>

<style lang="stylus">
@import '~@/style/variable'

.layout
  position relative
  display flex
  background #f5f7f9
  height 100vh
.avatar
  position absolute
  bottom 16px
  left 15px
  cursor pointer
  &:hover
    color #000
    opacity 0.6
.pop-box
  position absolute
  left 70px
  bottom 16px
  min-width 120px
  padding 5px 0
  z-index 100
  font-size 14px
  background #fff
  box-shadow 0 0 24px rgba(0, 0, 0, 0.18)
.pop-menu-item
  margin 0
  line-height normal
  padding 7px 16px
  clear both
  color #333
  white-space nowrap
  list-style none
  cursor pointer
  transition background 0.2s ease-in-out
  &:hover
    background #f3f3f3
.pop-menu-item-selected
  color #fff
  background $color-primary
</style>
