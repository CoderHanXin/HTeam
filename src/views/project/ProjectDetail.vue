<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">{{project.name}}</h5>
        <div v-if="isAdmin" @click="handleProjectEditShow" class="more">
          <Icon type="ios-gear"></Icon>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :activeName="activeMenuName" @on-select="handleChangeMenu">
        <menu-item name="all">
          <Icon type="ios-folder" size="16"></Icon>
          所有任务
        </menu-item>
        <menu-item name="processing">
          <Icon type="ios-list" size="16"></Icon>
          正在进行
        </menu-item>
        <menu-item name="done">
          <Icon type="ios-pricetag" size="16"></Icon>
          已完成
        </menu-item>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div class="header">
        <div class="title">{{mainTitle}}</div>
      </div>
      <Content class="content">
      </Content>
    </Layout>
    <ProjectEdit v-model="isProjectEditVisable" @onProjectEditOk="handleProjectEditOk" @onProjectEditCancel="handleProjectEditCancel" :project="project" :projectUsers="projectUsers" :users="allUsers" :groups="allGroups">
    </ProjectEdit>
  </Layout>
</template>

<script>
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import { mapGetters, mapMutations } from 'vuex'
import ProjectEdit from '@/views/project/ProjectEdit'
export default {
  name: 'ProjectDetail',
  components: {
    ProjectEdit
  },
  data() {
    return {
      project: {
        id: '',
        name: '',
        users: []
      },
      projectUsers: [],
      activeMenuName: 'all',
      isProjectEditVisable: false,
      list: []
    }
  },
  computed: {
    mainTitle() {
      switch (this.activeMenuName) {
        case 'all':
          return '所有任务'
        case 'processing':
          return '正在进行'
        case 'done':
          return '已完成'
      }
    },
    isAdmin() {
      return this.currentTeam.team_user.role_id === 1 ||
        this.currentTeam.team_user.role_id === 2
    },
    ...mapGetters([
      'currentUser',
      'currentTeam',
      'allUsers',
      'allGroups'
    ])
  },
  watch: {
    $route(to, from) {
      this.project.id = to.params.id
      this.project.name = to.params.name
    }
  },
  created() {
    this.project.id = this.$route.params.id
    this.project.name = this.$route.params.name
    this.init()
  },
  methods: {
    init() {
      this.getProject()
      if (this.allUsers.length === 0) {
        this.getUserList()
      }
    },
    getProject() {
      projectService.get(this.project.id).then(res => {
        this.project = res.data.data
      })
    },
    getUserList() {
      teamService.getAllUsersAndGroups(this.currentTeam.id).then(res => {
        this.setAllUsers(res.data.data.users)
        this.setAllGroups(res.data.data.groups)
      })
    },
    handleChangeMenu(name) {
      this.activeMenuName = name
    },
    handleProjectEditOk() {
      this.$Message.info('操作成功')
      this.getProject()
      this.isProjectEditVisable = false
    },
    handleProjectEditCancel() {
      this.isProjectEditVisable = false
    },
    handleProjectEditShow() {
      this.projectUsers = []
      for (const user of this.project.users) {
        this.projectUsers.push(user.id)
      }
      this.isProjectEditVisable = true
    },
    ...mapMutations([
      'setAllUsers',
      'setAllGroups'
    ])
  }
}
</script>

<style>

</style>
