<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">{{project.name}}</h5>
      </div>
      <Menu class="menu" theme="light" width="auto" @on-select="handleChangeMenu">
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
        <div class="title">task detail</div>
      </div>
      <Content class="content">
        <div class="task-detail">
          <div class="task-detail-header">
            <Checkbox @on-change="handleTaskCheck()" v-model="task.done" :true-value="1" :false-value="0" :size="'large'"></Checkbox>
            <div class="title">
              <span>任务001任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长</span>
            </div>
          </div>
          <div class="task-detail-body">
            <div class="task-detail-info">
              <div class="info-item">
                <Dropdown trigger="click" placement="bottom">
                  <a class="link-text">{{task.user.name || '未指派'}}</a>
                  <DropdownMenu slot="list">
                    <DropdownItem v-if="isAssigned" :name="-1">未指派</DropdownItem>
                    <DropdownItem v-for="(item, index) in allUsers" :divided="isAssigned && index===0" :key="item.id" :name="item.id">{{item.name}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div class="info-item">
                <DatePicker @on-change="datePickerChange" @on-clear="datePickerClear" @on-ok="datePickerOk" :open="isDatePickerOpen" :value="task.deadline" :options="dateOptions" confirm type="date" format="yyyy-MM-dd" placement="bottom">
                  <a class="link-text deadline" @click="datePickerClick" v-show="!isDateSelected">没有截止时间</a>
                  <a class="link-text deadline" @click="datePickerClick" v-show="isDateSelected">{{deadlineLabel | deadline}}</a>
                </DatePicker>
              </div>
              <div class="info-item">
                <Dropdown trigger="click" placement="bottom">
                  <a class="link-text">
                    <Icon class="level-icon-off" type="alert"></Icon>
                    <Icon class="level-icon-off" type="alert"></Icon>
                    <Icon class="level-icon-off" type="alert"></Icon>
                    正常处理
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      有空再看
                    </DropdownItem>
                    <DropdownItem>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      正常处理
                    </DropdownItem>
                    <DropdownItem>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      优先处理
                    </DropdownItem>
                    <DropdownItem>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      十万火急
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div class="task-detail-content">contents</div>
          </div>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'TaskDetail',
  data() {
    return {
      project: {
        id: '',
        name: ''
      },
      task: {
        deadline: '',
        done: 0,
        user: {}
      },
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
    isDateSelected() {
      return this.deadlineLabel && true
    },
    isAssigned() {
      if (!this.task.user) {
        return false
      }
      if (!this.task.user.name) {
        return false
      }
      return true
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
    }
  },
  created() {
    this.project.id = this.$route.params.id
    if (this.$route.params.name) {
      this.project.name = this.$route.params.name
    }
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
      this.$router.push({
        name: 'project-task-list',
        params: {
          id: this.project.id,
          name: this.project.name,
          listType: name
        }
      })
    },
    handleTaskCheck() {

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

<style lang="stylus" scoped>
.level-icon-on
  color #ed3f14
.level-icon-off
  color #ccc
</style>

