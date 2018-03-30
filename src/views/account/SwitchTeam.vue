<template>
  <div class="account-page">
    <div class="account-con">
      <div class="hd">
        <span>HTeam</span>
      </div>
      <div class="bd">
        <ul class="teams">
          <li @click="switchTeam(item)" v-for="item in list" :key="item.id">{{item.name}}</li>
          <li @click="showCreate" class="new">
            <Icon type="plus"></Icon>
            创建新团队
          </li>
        </ul>
        <div class="logout">
          <a @click="loginOut" class="link-text">退出</a>
        </div>
      </div>
    </div>
    <Modal v-model="visable" :loading="modalLoading" @on-ok="handleOk" @on-cancel="handleCancel" title="创建新团队" width="360">
      <Form ref="teamForm" :model="team" :rules="rules">
        <FormItem prop="name">
          <Input type="text" v-model.trim="team.name" :maxlength="20" size="large" placeholder="团队名称，例如：研发团队" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import teamService from '@/api/services/team'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'SwitchTeam',
  data() {
    return {
      visable: false,
      modalLoading: true,
      team: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入团队名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    list() {
      return [...this.teams]
    },
    ...mapGetters([
      'currentUser',
      'teams'
    ])
  },
  methods: {
    switchTeam(item) {
      this.setCurrentTeam(item)
      this.$router.replace({
        name: 'project'
      })
    },
    loginOut() {
      this.logout()
      this.$router.push({
        name: 'login'
      })
    },
    showCreate() {
      this.visable = true
    },
    handleOk() {
      this.$refs.teamForm.validate(valid => {
        if (valid) {
          teamService.add(this.team.name, this.currentUser.id).then(res => {
            if (res.data.code === 0) {
              let list = [...this.teams]
              list.push(res.data.data)
              this.setTeams(list)
              Cookies.set('teams', list)
            }
            this.visable = false
          })
        }
      })
    },
    handleCancel() {
      this.$refs.teamForm.resetFields()
    },
    ...mapMutations([
      'setCurrentTeam',
      'setTeams'
    ]),
    ...mapActions([
      'logout'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'

.teams
  position relative
  width 360px
  margin 0 auto
  text-align center
  overflow hidden
  border 1px solid #ccc
  border-radius 4px
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.05)
  li
    position relative
    height 64px
    padding 0 16px
    line-height 64px
    font-size 24px
    color $color-text-light
    background #fff
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    cursor pointer
    border-bottom 1px solid #ccc
    &:hover
      background $color-background-hover
  .new
    font-size 20px
    color $color-grey
    border-bottom none
    background #ececec
    &:hover
      background $color-background-hover
.logout
  margin-top 48px
  font-size 14px
</style>
