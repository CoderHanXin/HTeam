<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">项目</h5>
        <div v-if="isAdmin" @click="handleProjectAddShow" class="more">
          <Icon type="android-add"></Icon>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :activeName="activeMenuName" @on-select="handleChangeMenu">
        <menu-item name="all">
          <Icon type="ios-folder" size="16"></Icon>
          所有项目
        </menu-item>
        <menu-item name="created">
          <Icon type="ios-list" size="16"></Icon>
          我创建的
        </menu-item>
        <menu-item name="joined">
          <Icon type="ios-pricetag" size="16"></Icon>
          我参与的
        </menu-item>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div class="header">
        <div class="title">{{mainTitle}}</div>
      </div>
      <Content class="content">
        <div class="project-list">
          <ul>
            <li v-for="item in list" :key="item.id" @click="gotoDetail(item)" class="project-item">
              <Card :bordered="false" :padding="0">
                <div class="project-item-wrapper">
                  <div class="project-item-body">
                    <div class="project-item-title">{{item.name}}</div>
                    <div class="project-item-meta">
                      <span class="project-item-meta-text">待处理任务</span>
                      <span class="task-count">10</span>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          </ul>
        </div>
      </Content>
    </Layout>
    <ProjectAdd v-model="isProjectAddVisable" @onProjectAddOk="handleProjectAddOk" @onProjectAddCancel="handleProjectAddCancel" :teamId="currentTeam.id" :users="allUsers" :groups="allGroups">
    </ProjectAdd>
  </Layout>
</template>

<script>
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import { mapGetters, mapMutations } from 'vuex'
import ProjectAdd from '@/views/project/ProjectAdd'
export default {
  name: 'Project',
  components: {
    ProjectAdd
  },
  data() {
    return {
      activeMenuName: 'all',
      isProjectAddVisable: false,
      list: []
    }
  },
  computed: {
    mainTitle() {
      switch (this.activeMenuName) {
        case 'all':
          return '所有任务'
        case 'created':
          return '我创建的'
        case 'joined':
          return '我参与的'
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
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getProjectList()
      if (this.allUsers.length === 0) {
        this.getUserList()
      }
    },
    getProjectList() {
      projectService.getList(this.currentTeam.id).then(res => {
        this.list = res.data.data
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
    handleProjectAddOk() {
      this.getProjectList()
      this.$Message.info('操作成功')
      this.isProjectAddVisable = false
    },
    handleProjectAddCancel() {
      this.isProjectAddVisable = false
    },
    handleProjectAddShow() {
      this.isProjectAddVisable = true
    },
    gotoDetail(project) {
      this.$router.push({
        name: 'project-task',
        params: {
          id: project.id,
          name: project.name
        }
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
@import '~@/style/mixin'
@import '~@/style/variable'

.project-list
  flex auto
  padding 10px 0
  background $color-background-light
.project-item
  padding-bottom 2px
  font-size 14px
  cursor pointer
.project-item-wrapper
  padding 0 20px
.project-item-body
  position relative
  display flex
  padding 16px 0
  &:after
    setBottomLine(#eee)
.project-item-title
  flex 1
  width 0
  padding-right 16px
  font-size 14px
  color $color-text
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
.project-item-meta
  flex-shrink 0
.project-item-meta-text
  color $color-grey
  font-size 12px
.project-item-meta-count
  color $color-text
  font-size 14px
</style>
