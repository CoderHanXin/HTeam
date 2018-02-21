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
      <Content class="content">
        <div class="task-detail">
          <div class="task-detail-header">
            <Checkbox @on-change="handleCheck()" v-model="task.done" :true-value="1" :false-value="0" :size="'large'"></Checkbox>
            <div class="title">
              <span :class="{'task-done': task.done}">{{task.title}}</span>
            </div>
          </div>
          <div class="task-detail-content">
            <div class="task-detail-info">
              <div class="info-item">
                <Dropdown @on-click="setAssignee" trigger="click" placement="bottom">
                  <a class="link-text">{{assignee}}</a>
                  <DropdownMenu slot="list">
                    <DropdownItem v-if="isAssigned" :name="null">未指派</DropdownItem>
                    <DropdownItem v-for="(item, index) in allUsers" :divided="isAssigned && index===0" :key="item.id" :name="item.id">{{item.name}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div class="info-item">
                <DatePicker @on-change="datePickerChange" @on-clear="datePickerClear" @on-ok="datePickerOk" :open="isDatePickerOpen" :value="task.deadline" :options="dateOptions" confirm type="date" format="yyyy-MM-dd" placement="bottom">
                  <a class="link-text deadline" @click="datePickerClick">{{deadlineLabel | deadline}}</a>
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
              <div class="info-item right">
                <Button @click="handleEdit" type="primary" shape="circle" size="small">编辑</Button>
                <Button @click="handleDelete" type="error" shape="circle" size="small">删除</Button>
              </div>
            </div>
            <div class="task-detail-desc">{{task.desc}}</div>
          </div>
          <div class="task-detail-events">
            <ul>
              <li v-for="item in task.events" :key="item.id" class="task-detail-event-item">
                <div class="event-icon">
                  <Icon size="32" :type="eventIcon(item.type)" :color="eventIconColor(item.type)"></Icon>
                </div>
                <span class="event-text">{{item.created_at | eventTime}}</span>
                <span class="event-text">{{item.user.name}}</span>
                <span class="event-text">{{item.event}}</span>
                <span v-if="item.deadline" class="event-text">{{item.deadline | deadline}}</span>
              </li>
            </ul>
          </div>
          <div class="task-detail-comments">
            <ul>
              <li v-for="item in task.comments" :key="item.id" class="task-detail-comment-item">
                <div class="comment-icon">
                  <Avatar style="background:#5cadff" size="large">{{item.user.name.substr(-2)}}</Avatar>
                </div>
                <div class="comment-box">
                  <div class="comment-meta">
                    <span>{{item.user.name}}</span>
                    <span>
                      <Icon type="ios-clock-outline"></Icon>
                      {{item.created_at}}</span>
                  </div>
                  <div class="comment-content">{{item.content}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="editor-wrapper">
            <div class="editor">
              <textarea v-model="comment" @keyup.enter="submitComment" class="editor-textarea" rows="4" placeholder="在此输入评论内容，按回车键（Enter）提交"></textarea>
            </div>
            <div class="toolbar">
              <div @click="submitComment" class="editor-submit" title="提交">
                <Icon size="14" type="ios-redo"></Icon>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import taskService from '@/api/services/task'
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import taskEvent from '../../common/constant/task_event'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'TaskDetail',
  data() {
    return {
      project: {
        id: '',
        name: ''
      },
      taskId: -1,
      task: {
        title: '',
        deadline: '',
        done: 0,
        user: {}
      },
      comment: '',
      assignee: '未指派',
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
    isAssigned() {
      return this.assignee !== '未指派'
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
      this.taskId = this.$route.params.taskId
      this.init()
    }
  },
  created() {
    this.project.id = this.$route.params.id
    if (this.$route.params.name) {
      this.project.name = this.$route.params.name
    }
    this.taskId = this.$route.params.taskId
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
      taskService.get(this.taskId).then(res => {
        this.task = res.data.data
        this.assignee = this.task.user ? this.task.user.name : '未指派'
        this.deadlineLabel = this.task.deadline
        console.log(this.task)
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
    submitComment() {
      let comment = {}
      comment.content = this.comment
      comment.user_id = this.currentUser.id
      taskService.addComment(this.taskId, comment).then(res => {
        this.comment = ''
        this.getTask()
      })
    },
    setAssignee(name) {
      let tempAssignee = ''
      let task = {}
      task.user_id = name
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId

      if (name === null) {
        tempAssignee = '未指派'
        event.type = taskEvent.unassign
        event.event = taskEvent.unassignText.replace('{assignee}', this.assignee)
      } else {
        for (const user of this.allUsers) {
          if (user.id === name) {
            tempAssignee = user.name
            break
          }
        }
        event.type = taskEvent.assign
        event.event = taskEvent.assignText.replace('{assignee}', tempAssignee)
      }

      taskService.update(this.taskId, task, event).then(res => {
        this.assignee = tempAssignee
      })
    },
    handleCheck() {
      let task = {}
      task.done = this.task.done
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      if (task.done) {
        event.type = taskEvent.done
        event.event = taskEvent.doneText
      } else {
        event.type = taskEvent.reopen
        event.event = taskEvent.reopenText
      }
      taskService.update(this.taskId, task, event).then(res => {
      })
    },
    handleEdit() {

    },
    handleDelete() {

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
      let task = {}
      task.deadline = null
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      event.type = taskEvent.noDeadline
      event.event = taskEvent.noDeadlineText
      taskService.update(this.taskId, task, event).then(res => {
        this.isDatePickerOpen = false
      })
    },
    datePickerOk() {
      let task = {}
      task.deadline = this.task.deadline
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      event.type = taskEvent.deadline
      event.event = taskEvent.deadlineText
      event.deadline = this.task.deadline
      taskService.update(this.taskId, task, event).then(res => {
        this.deadlineLabel = this.task.deadline
        this.isDatePickerOpen = false
      })
    },
    eventIcon(type) {
      switch (type) {
        case 'create':
          return 'ios-plus'
        case 'done':
          return 'ios-checkmark'
        case 'reopen':
          return 'ios-refresh'
        case 'update':
          return 'ios-information'
        case 'assign':
          return 'ios-navigate'
        case 'unassign':
          return 'ios-navigate'
        case 'deadline':
          return 'ios-clock'
        case 'noDeadline':
          return 'ios-clock'
      }
    },
    eventIconColor(type) {
      switch (type) {
        case 'create':
          return '#2d8cf0'
        case 'done':
          return '#19be6b'
        case 'reopen':
          return '#ff9900'
        case 'update':
          return '#b47fd4'
        case 'assign':
          return '#2d8cf0'
        case 'unassign':
          return '#ff9900'
        case 'deadline':
          return '#b47fd4'
        case 'noDeadline':
          return '#ff9900'
      }
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

