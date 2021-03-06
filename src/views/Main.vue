<template>
  <div class="layout">
    <MainSider :activeName="mainRoute" @on-select="handleChangeMenu">
      <div :title="currentTeam.name" class="sider-logo">
        <div>
          <img src="../../static/logo.png">
        </div>
      </div>
      <MainSiderItem name="project">
        <Icon size="20" type="folder"></Icon>
        <p>项目</p>
      </MainSiderItem>
      <MainSiderItem name="team">
        <Icon size="20" type="ios-people"></Icon>
        <p>团队</p>
      </MainSiderItem>
      <MainSiderItem name="stats">
        <Icon size="20" type="stats-bars"></Icon>
        <p>统计</p>
      </MainSiderItem>
    </MainSider>
    <Layout>
      <router-view></router-view>
    </Layout>
    <div class="avatar" @click="togglePopMenu">
      <Avatar :style="{background: currentUser.color || '#2d8cf0'}" size="large">{{avatarName}}</Avatar>
    </div>
    <div class="pop-box" v-clickoutside="handlePopMenuClose" :style="popMenuStyle">
      <ul class="pop-menu">
        <li class="pop-menu-item" @click="gotoAccount">个人中心</li>
        <li class="pop-menu-item" @click="showEditPass">修改密码</li>
        <li class="pop-menu-item" @click="loginOut">退出</li>
      </ul>
    </div>
    <Modal v-model="editPasswordModal" :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2d8cf0">修改密码</h3>
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
import userService from '@/api/services/user'
import { mapGetters, mapActions } from 'vuex'
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
      // let main = this.$route.name.split('-')
      let main = this.$route.path.split('/')
      return main && main[1]
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
    },
    ...mapGetters([
      'currentUser',
      'currentTeam'
    ])
  },
  created() {
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
          userService.changePassword(
            this.currentUser.id,
            this.changePassword.oldPass,
            this.changePassword.newPass,
            this.changePassword.rePass)
            .then(res => {
              if (res.data.code === 0) {
                this.saveLoading = false
                this.editPasswordModal = false
                this.$Message.success('操作成功')
              } else {
                this.saveLoading = false
                this.oldPassError = res.data.message
              }
            })
        }
      })
    },
    cancelEditPass() {
      this.editPasswordModal = false
    },
    loginOut() {
      this.popMenuVisable = false
      this.logout()
      this.$router.push({
        name: 'login'
      })
    },
    ...mapActions([
      'logout'
    ])
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
.sider-logo
  display inline-block
  padding 20px 20px 16px
  cursor pointer
  img
    display block
    width 100%
    height 100%
.avatar
  position absolute
  bottom 16px
  left 16px
  cursor pointer
  &:hover
    color #000
    opacity 0.6
.pop-box
  position absolute
  left 72px
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
    background $color-background-hover
.pop-menu-item-selected
  color #fff
  background $color-primary
</style>
