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
          <Icon type="ios-settings-strong" size="16"></Icon>
          所有任务
        </menu-item>
        <menu-item name="processing">
          <Icon type="ios-shuffle-strong" size="16"></Icon>
          正在进行
        </menu-item>
        <menu-item name="done">
          <Icon type="ios-checkmark" size="16"></Icon>
          已完成
        </menu-item>
      </Menu>
      <div class="sub-header">
        <h5 class="title">标签</h5>
        <div v-if="isAdmin" @click="handleTagsShow" class="more">
          <Icon type="android-add"></Icon>
        </div>
      </div>
      <SiderMenu :size="12">
        <SiderMenuItem name="1">
          <Icon color="#990000" type="ios-pricetag"></Icon>
          标签1
        </SiderMenuItem>
        <SiderMenuItem name="2">
          <Icon color="#009900" type="ios-pricetag"></Icon>
          标签2
        </SiderMenuItem>
      </SiderMenu>
    </Sider>
    <router-view/>
    <ProjectEdit v-model="isProjectEditVisable" @onProjectEditOk="handleProjectEditOk" @onProjectEditCancel="handleProjectEditCancel" :project="project" :projectUsers="projectUsers" :users="allUsers" :groups="allGroups">
    </ProjectEdit>
    <Tags v-model="isTagsVisable" @onTagsCancel="handleTagsCancel"></Tags>
  </Layout>
</template>

<script>
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import { mapGetters, mapMutations } from 'vuex'
import ProjectEdit from '@/views/project/ProjectEdit'
import Tags from '@/views/components/tags/Tags'
import SiderMenu from '@/views/components/sider-menu/SiderMenu'
import SiderMenuItem from '@/views/components/sider-menu/SiderMenuItem'
export default {
  name: 'Tasks',
  components: {
    Tags,
    SiderMenu,
    SiderMenuItem,
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
      isTagsVisable: false
    }
  },
  computed: {
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
      if (to.params.name) {
        this.project.name = to.params.name
      }
      this.activeMenuName = this.$route.params.listType || 'all'
    }
  },
  created() {
    this.project.id = this.$route.params.id
    if (this.$route.params.name) {
      this.project.name = this.$route.params.name
    }
    this.activeMenuName = this.$route.params.listType || 'all'
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
        this.setProjectMembers(this.project.users)
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
      this.$router.push({
        name: 'project-task-list',
        params: {
          id: this.project.id,
          name: this.project.name,
          listType: name
        }
      })
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
    handleTagsShow() {
      this.isTagsVisable = true
    },
    handleTagsCancel() {
      this.isTagsVisable = false
    },
    ...mapMutations([
      'setProjectMembers',
      'setAllUsers',
      'setAllGroups'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>

