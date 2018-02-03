<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">团队</h5>
        <div class="more">
          <Button type="ghost" shape="circle" size="small" icon="android-add"></Button>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :active-name="$route.name" @on-select="handleChangeMenu">
        <menu-item name="team">
            <Icon type="ios-barcode-outline" size="16"></Icon>
            {{currentTeam.name}}
        </menu-item>
        <MenuGroup title="分组">
          <menu-item v-for="(item, index) in groupList" :key="item.id" :name="`group-${index}-${item.id}`">
            <Icon type="ios-people" size="16"></Icon>
            {{item.name}}
          </menu-item>
        </MenuGroup>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div class="header">
        <div class="title">
          <CzsIcon type="control-rank" size="16" class="margin-right-4"></CzsIcon>全部成员
        </div>
      </div>
      <Content class="content">
        <div>
          <div class="filter-container">
            <Form inline>
              <!-- <Input v-model="search.name" placeholder="姓名" style="width:100px" class="margin-right-4"/>
              <Button @click="handleSearch" type="primary" icon="ios-search" class="margin-right-4">搜索</Button> -->
              <Button v-if="currentMenuIsTeam" @click="handleTeamUserAdd" type="success" class="margin-right-4">添加成员</Button>
              <Button v-if="currentMenuIsTeam" @click="handleGroupAddShow" type="primary" class="margin-right-4">新建分组</Button>
              <Button v-if="!currentMenuIsTeam" @click="handleGroupAddShow" type="primary" class="margin-right-4">设置分组</Button>
              <Button v-if="!currentMenuIsTeam" @click="handleDeleteGroup" type="error" class="margin-right-4">删除分组</Button>
            </Form>
          </div>
          <Table border :columns="columns" :data="currentUserList" :loading="isLoading" ref="table" class="team-table"></Table>
          <TeamUser 
            v-model="isTeamUserVisable"
            @onTeamUserOk="handleTeamUserOk"
            @onTeamUserCancel="handleTeamUserCancel" 
            :isEdit="isEditTeamUser"
            :teamId="currentTeam.id" 
            :teamUser="teamUser"></TeamUser>
          <GroupAdd 
            v-model="isGroupAddVisable" 
            @onGroupAddOk="handleGroupAddOk" 
            @onGroupAddCancel="handleGroupAddCancel" 
            :teamId="currentTeam.id" 
            :users="userList"></GroupAdd>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import Cookies from 'js-cookie'
import url from '../../api/url'
import role from '../../common/constant/role'
import GroupAdd from '@/views/team/GroupAdd'
import TeamUser from '@/views/team/TeamUser'
export default {
  name: 'Team',
  components: {
    GroupAdd,
    TeamUser
  },
  data() {
    return {
      roleList: role,
      currentTeam: {},
      isGroupAddVisable: false,
      isTeamUserVisable: false,
      isEditTeamUser: false,
      teamUser: {},
      user: {
        id: 0,
        name: '',
        username: '',
        password: '',
        phone: '',
        desc: ''
      },
      isLoading: false,
      currentGroupIndex: 0,
      currentGroupId: 0,
      currentMenuIsTeam: true,
      userList: [],
      groupList: [],
      search: {
        name: '',
        status: 1
      },
      columns: [
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
          title: '手机号',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
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
                    this.handleTeamUserEdit(params.row)
                  }
                }
              },
              '设置'
            )
          }
        }
      ],
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        phone: [
          {
            type: 'string',
            pattern: /^\d+$/gi,
            message: '手机号只能是数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    currentUserList() {
      if (this.currentMenuIsTeam) {
        return this.userList
      } else {
        let list = []
        let groupUsers = this.groupList[this.currentGroupIndex].users
        for (const user of this.userList) {
          for (const groupUser of groupUsers) {
            if (user.id === groupUser.id) {
              list.push(user)
            }
          }
        }
        return list
      }
    }
  },
  created() {
    this.currentTeam = Cookies.getJSON('currentTeam')
    this.init()
  },
  methods: {
    handleSearch() {
      this.getUserList()
    },
    handleTeamUserOk() {
      this.isTeamUserVisable = false
      this.getUserList()
    },
    handleTeamUserCancel() {
      this.isTeamUserVisable = false
    },
    handleTeamUserAdd() {
      this.teamUser = this.user
      this.isEditTeamUser = false
      this.isTeamUserVisable = true
    },
    handleTeamUserEdit(row) {
      this.teamUser.id = row.id
      this.teamUser.name = row.name
      this.teamUser.phone = row.phone
      this.teamUser.desc = row.desc
      this.isEditTeamUser = true
      this.isTeamUserVisable = true
    },
    handleGroupAddOk() {
      this.isGroupAddVisable = false
    },
    handleGroupAddCancel() {
      this.isGroupAddVisable = false
    },
    handleGroupAddShow() {
      this.isGroupAddVisable = true
    },
    handleDeleteGroup() {

    },
    handleChangeMenu(name) {
      if (name === 'team') {
        this.currentMenuIsTeam = true
      } else {
        let temp = name.split('-')
        this.currentGroupIndex = temp[1]
        this.currentGroupId = temp[2]
        this.currentMenuIsTeam = false
      }
      console.log(name)
    },
    init() {
      this.getUserList()
    },
    getUserList(type, id) {
      this.isLoading = true
      this.search.teamId = this.currentTeam.id
      this.$http.get(url.user, this.search).then(res => {
        this.userList = res.data.data.users
        this.groupList = res.data.data.groups
        this.isLoading = false
        console.log(this.userList)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
