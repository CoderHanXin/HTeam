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
        <div class="task-quick-add">
          <input class="title" v-model="task.title" @keyup.enter="createTask" :autofocus="true" placeholder="添加新任务，按回车键（Enter）保存" />
          <div class="meta">
            <div class="owner">
              <Dropdown @on-click="selectOwner" trigger="click">
                <a class="link-text" href="javascript:void(0)">
                  {{owner}}
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-if="isOwnerSelected" :name="-1">未指派</DropdownItem>
                  <DropdownItem v-for="(item, index) in allUsers" :divided="isOwnerSelected && index===0" :key="item.id" :name="item.id">{{item.name}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <DatePicker @on-change="datePickerChange" @on-clear="datePickerClear" @on-ok="datePickerOk" :open="isDatePickerOpen" :value="task.deadline" :options="dateOptions" :transfer="true" type="datetime" format="yyyy-MM-dd HH:mm" placement="bottom-end">
              <a class="link-text" @click="datePickerClick" v-show="!isDateSelected">没有截止时间</a>
              <a class="link-text deadline" @click="datePickerClick" v-show="isDateSelected">{{deadlineLabel | deadline}}</a>
            </DatePicker>
          </div>
        </div>
        <div class="task-list">
          <ul>
            <li class="task-item">
              <Card :bordered="false" :padding="0">
                <div class="task-item-wrapper">
                  <div class="task-item-body">
                    <Checkbox :size="'large'" class="task-check"></Checkbox>
                    <div class="task-item-title">
                      <span>任务001任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长</span>
                    </div>
                    <div class="task-item-meta">
                      <span class="task-owner">老韩</span>
                      <span class="task-label">
                        <Icon type="ios-clock-outline"></Icon>
                        1月31日</span>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          </ul>
        </div>
      </Content>
    </Layout>
    <ProjectEdit v-model="isProjectEditVisable" @onProjectEditOk="handleProjectEditOk" @onProjectEditCancel="handleProjectEditCancel" :project="project" :projectUsers="projectUsers" :users="allUsers" :groups="allGroups">
    </ProjectEdit>
  </Layout>
</template>

<script>
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import taskService from '@/api/services/task'
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
      list: [],
      task: {
        title: '',
        deadline: ''
      },
      owner: '未指派',
      ownerId: -1,
      deadlineLabel: '',
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      isDatePickerOpen: false
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
    isDateSelected() {
      return this.deadlineLabel && true
    },
    isOwnerSelected() {
      return this.owner !== '未指派'
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
      this.getTask()
      if (this.allUsers.length === 0) {
        this.getUserList()
      }
    },
    getProject() {
      projectService.get(this.project.id).then(res => {
        this.project = res.data.data
      })
    },
    getTask() {
      let done
      if (this.activeMenuName === 'processing') {
        done = false
      } else if (this.activeMenuName === 'done') {
        done = true
      }
      taskService.getList(this.project.id, done).then(res => {
        this.list = res.data.data
        console.log(this.list)
      })
    },
    createTask() {
      let title = this.task.title.trim()
      if (title === '') {
        return
      }
      let task = {}
      task.title = title
      if (this.task.deadline) {
        task.deadline = this.task.deadline
      }
    },
    getUserList() {
      teamService.getAllUsersAndGroups(this.currentTeam.id).then(res => {
        this.setAllUsers(res.data.data.users)
        this.setAllGroups(res.data.data.groups)
      })
    },
    handleChangeMenu(name) {
      this.activeMenuName = name
      this.getTask()
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
    selectOwner(name) {
      this.ownerId = name
      if (name === -1) {
        this.owner = '未指派'
        return
      }

      for (const user of this.allUsers) {
        if (user.id === name) {
          this.owner = user.name
          return
        }
      }
    },
    datePickerClick() {
      this.isDatePickerOpen = !this.isDatePickerOpen
    },
    datePickerChange(date) {
      this.task.deadline = date
      if (this.task.deadline === '') {
        this.deadlineLabel = this.task.deadline
      }
    },
    datePickerClear() {
      this.isDatePickerOpen = false
    },
    datePickerOk() {
      this.deadlineLabel = this.task.deadline
      this.isDatePickerOpen = false
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
