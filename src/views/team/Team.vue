<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">团队</h5>
        <div v-if="isAdmin" class="more">
        </div>
      </div>
      <Menu ref="teamMenu" class="menu" theme="light" width="auto" :active-name="activeMenuName" @on-select="handleChangeMenu">
        <menu-item name="team">
          <Icon type="ios-barcode-outline" size="16"></Icon>
          {{currentTeam.name}}
        </menu-item>
        <MenuGroup v-if="groupList.length" title="分组">
          <menu-item v-for="(item, index) in groupList" :key="item.id" :name="`group-${index}-${item.id}`">
            <Icon type="ios-people" size="16"></Icon>
            {{item.name}}
          </menu-item>
        </MenuGroup>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div class="header">
        <div class="title">{{mainTitle}}</div>
      </div>
      <Content class="content">
        <div>
          <div v-if="isAdmin" class="filter-container">
            <Form inline>
              <!-- <Input v-model="search.name" placeholder="姓名" style="width:100px" class="margin-right-4"/>
              <Button @click="handleSearch" type="primary" icon="ios-search" class="margin-right-4">搜索</Button> -->
              <Button v-if="currentMenuIsTeam" @click="handleTeamUserAddShow" type="success" class="margin-right-4">添加成员</Button>
              <Button v-if="currentMenuIsTeam" @click="handleInviteShow" type="success" class="margin-right-4">邀请成员</Button>
              <Button v-if="currentMenuIsTeam" @click="handleGroupAddShow" type="primary" class="margin-right-4">新建分组</Button>
              <Button v-if="!currentMenuIsTeam" @click="handleGroupEditShow" type="primary" class="margin-right-4">设置分组</Button>
              <Button v-if="!currentMenuIsTeam" @click="handleDeleteGroup" type="error" class="margin-right-4">删除分组</Button>
            </Form>
          </div>
          <Table border :columns="columns" :data="currentUserList" :loading="isLoading" ref="table" class="team-table"></Table>
          <TeamUser v-model="isTeamUserVisable" @onTeamUserOk="handleTeamUserOk" :isEdit="isEditTeamUser" :teamId="currentTeam.id" :teamUser="teamUser"></TeamUser>
          <GroupAdd v-model="isGroupAddVisable" @onGroupAddOk="handleGroupAddOk" :teamId="currentTeam.id" :users="userList"></GroupAdd>
          <GroupEdit v-if="groupList" v-model="isGroupEditVisable" @onGroupEditOk="handleGroupEditOk" :group="currentGroup" :groupUsers="currentGroupUsers" :users="userList"></GroupEdit>
        </div>
      </Content>
    </Layout>
    <Modal v-model="isInviteVisable" :loading="modalLoading" @on-ok="handleInviteOk" @on-cancel="handleInviteCancel" title="通过邮件邀请成员" width="360">
      <Form ref="inviteForm" :model="inviteUser" :rules="rules">
        <FormItem prop="email">
          <Input type="email" v-model.trim="inviteUser.email" :maxlength="50" size="large" placeholder="请输入新成员的邮箱" />
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script>
import teamService from '@/api/services/team'
import userService from '@/api/services/user'
import role from '@/common/constant/role'
import { mapGetters, mapMutations } from 'vuex'
import GroupAdd from '@/views/team/GroupAdd'
import GroupEdit from '@/views/team/GroupEdit'
import TeamUser from '@/views/team/TeamUser'
export default {
  name: 'Team',
  components: {
    GroupAdd,
    GroupEdit,
    TeamUser
  },
  data() {
    return {
      isLoading: false,
      roleList: role,
      activeMenuName: 'team',
      isGroupAddVisable: false,
      isGroupEditVisable: false,
      currentGroupUsers: [],
      currentMenuIsTeam: true,
      isTeamUserVisable: false,
      isEditTeamUser: false,
      isInviteVisable: false,
      teamUser: {},
      userList: [],
      groupList: [],
      search: {
        name: '',
        status: 1
      },
      user: {
        id: 0,
        name: '',
        email: '',
        password: '',
        phone: '',
        desc: '',
        roleId: 3
      },
      modalLoading: true,
      inviteUser: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      tabelColumns: [
        {
          title: '姓名',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h(
                'strong',
                {
                  attrs: {
                    class: 'team-cell-user-name'
                  }
                },
                params.row.name
              ),
              h(
                'span',
                {
                  attrs: {
                    class: 'team-cell-user-role'
                  }
                },
                params.row.team_user.role_name
              )
            ])
          }
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '备注',
          key: 'desc'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleTeamUserEditShow(params.row)
                  }
                }
              },
              '设置'
            )
          }
        }
      ]
    }
  },
  computed: {
    currentUserList() {
      if (this.currentMenuIsTeam) {
        return this.userList
      } else {
        let list = []
        for (const user of this.userList) {
          for (const groupUser of this.currentGroup.users) {
            if (user.id === groupUser.id) {
              list.push(user)
            }
          }
        }
        return list
      }
    },
    currentGroup() {
      if (this.groupList.length > 0) {
        // copy object
        return Object.assign({}, this.groupList[this.currentGroupIndex])
      } else {
        return {
          name: ''
        }
      }
    },
    currentGroupIndex() {
      if (this.activeMenuName === 'team') {
        return 0
      } else {
        let temp = this.activeMenuName.split('-')
        return temp[1]
      }
    },
    currentGroupId() {
      if (this.activeMenuName === 'team') {
        return 0
      } else {
        let temp = this.activeMenuName.split('-')
        return temp[2]
      }
    },
    mainTitle() {
      if (this.activeMenuName === 'team') {
        return '全部成员'
      }
      return this.currentGroup.name
    },
    isAdmin() {
      return this.currentTeam.team_user.role_id === 1 ||
        this.currentTeam.team_user.role_id === 2
    },
    columns() {
      if (this.isAdmin) {
        return this.tabelColumns
      } else {
        this.tabelColumns.pop()
        return this.tabelColumns
      }
    },
    ...mapGetters([
      'currentUser',
      'currentTeam',
      'allUsers',
      'allGroups'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    handleSearch() {
      this.getUserList()
    },
    handleInviteShow() {
      this.isInviteVisable = true
    },
    handleInviteOk() {
      this.$refs.inviteForm.validate(valid => {
        if (valid) {
          userService.invite(this.currentUser.id, this.currentTeam.id, this.inviteUser.email).then(res => {
            if (res.data.code === 0) {
              this.$Message.info('邀请邮件已发送')
            } else {
              this.$Message.error({
                content: res.data.message,
                duration: 3
              })
            }
            this.isInviteVisable = false
          })
        }
      })
    },
    handleInviteCancel() {
      this.$refs.inviteForm.resetFields()
    },
    handleTeamUserOk() {
      this.getUserList()
    },
    handleTeamUserAddShow() {
      this.teamUser = Object.assign({}, this.user)
      this.isEditTeamUser = false
      this.isTeamUserVisable = true
    },
    handleTeamUserEditShow(row) {
      this.teamUser.id = row.id
      this.teamUser.name = row.name
      this.teamUser.phone = row.phone
      this.teamUser.desc = row.desc
      this.teamUser.roleId = row.team_user.role_id
      this.isEditTeamUser = true
      this.isTeamUserVisable = true
    },
    handleGroupAddOk() {
      this.getGroupList()
    },
    handleGroupAddShow() {
      this.isGroupAddVisable = true
    },
    handleGroupEditOk() {
      this.getGroupList()
    },
    handleGroupEditShow() {
      this.currentGroupUsers = []
      for (const user of this.currentGroup.users) {
        this.currentGroupUsers.push(user.id)
      }
      this.isGroupEditVisable = true
    },
    handleDeleteGroup() {
      this.$Modal.confirm({
        title: `确定删除分组吗`,
        content: '分组中的成员不会被从团队中删除。',
        loading: true,
        onOk: () => {
          teamService.deleteGroup(this.currentGroupId).then(res => {
            this.activeMenuName = 'team'
            this.$nextTick(() => {
              this.$refs.teamMenu.updateActiveName()
              this.handleChangeMenu('team')
            })
            this.getGroupList()
            this.$Modal.remove()
          })
        }
      })
    },
    handleChangeMenu(name) {
      this.activeMenuName = name
      if (name === 'team') {
        this.currentMenuIsTeam = true
      } else {
        this.currentMenuIsTeam = false
      }
    },
    init() {
      if (this.allUsers.length === 0) {
        this.getUserList()
      } else {
        this.userList = this.allUsers
        this.groupList = this.allGroups
      }
    },
    getUserList() {
      this.isLoading = true
      teamService.getAllUsersAndGroups(this.currentTeam.id).then(res => {
        this.userList = res.data.data.users
        this.groupList = res.data.data.groups
        this.setAllUsers(this.userList)
        this.setAllGroups(this.groupList)
        this.isLoading = false
      })
    },
    getGroupList() {
      teamService.getAllGroups(this.currentTeam.id).then(res => {
        this.groupList = res.data.data
        this.setAllGroups(this.groupList)
      })
    },
    ...mapMutations([
      'setAllUsers',
      'setAllGroups'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>
