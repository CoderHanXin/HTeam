<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
        <div class="panel-item">
          <Dropdown @on-click="handleDateFilter">
            <a class="link-text">
              {{dateFilterLabel}}
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="all" :selected="dateFilter === 'all'">所有时间</DropdownItem>
              <DropdownItem name="today" :selected="dateFilter === 'today'" divided>今天</DropdownItem>
              <DropdownItem name="tomorrow" :selected="dateFilter === 'tomorrow'">明天</DropdownItem>
              <DropdownItem name="thisWeek" :selected="dateFilter === 'thisWeek'">本周</DropdownItem>
              <DropdownItem name="nextWeek" :selected="dateFilter === 'nextWeek'">下周</DropdownItem>
              <DropdownItem name="after" :selected="dateFilter === 'after'">以后</DropdownItem>
              <DropdownItem name="expired" :selected="dateFilter === 'expired'" divided>已延误</DropdownItem>
              <DropdownItem name="noDeadline" :selected="dateFilter === 'noDeadline'">没有截止时间</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <Content class="content">
      <div class="task-quick-add">
        <input class="title" v-model.trim="task.title" @keydown.enter="createTask" :autofocus="true" placeholder="添加新任务，按回车键（Enter）保存" />
        <div class="meta">
          <div class="meta-item">
            <Select v-model="assigneeId" :label-in-value="true" :clearable="true" size="small" placeholder="未指派">
              <Option v-for="item in allUsers" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </div>
          <div class="meta-item">
            <DatePicker v-model="task.deadline" :clearable="true" :options="dateOptions" type="date" format="yyyy-MM-dd" placement="bottom-end" size="small" placeholder="截止时间"></DatePicker>
          </div>
        </div>
      </div>
      <div class="task-list">
        <ul>
          <li v-for="item in list" :key="item.id" class="task-item">
            <Card :bordered="false" :padding="0">
              <div class="task-item-wrapper">
                <div class="task-item-body">
                  <Checkbox @on-change="handleTaskCheck(item)" v-model="item.done" :true-value="1" :false-value="0" :size="'large'" class="task-check"></Checkbox>
                  <div @click="handleTaskClick(item)" class="task-item-title">
                    <span :class="{'task-done': item.done}">{{item.title}}</span>
                  </div>
                  <div class="task-item-meta">
                    <span class="task-item-meta-label">{{item.user ? item.user.name : '未指派'}}</span>
                    <span v-if="item.deadline" class="task-item-meta-label" :class="{'task-expired':taskExpired(item.deadline)}">
                      <Icon type="ios-clock-outline"></Icon>
                      {{item.deadline | deadline}}</span>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        </ul>
        <div v-if="!list || list.length === 0" class="list-empty">{{listEmpty}}</div>
      </div>
    </Content>
  </Layout>
</template>

<script>
import taskService from '@/api/services/task'
import taskEvent from '../../common/constant/task_event'
import util from '../../libs/util'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'TaskList',
  data() {
    return {
      project: {
        id: '',
        name: ''
      },
      listType: 'all',
      taskList: [],
      taskGroup: {
        today: [],
        tomorrow: [],
        thisWeek: [],
        nextWeek: [],
        after: [],
        expired: [],
        noDeadline: []
      },
      task: {
        title: '',
        deadline: ''
      },
      dateFilter: this.taskDateFilter || 'all',
      assigneeId: null,
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  computed: {
    mainTitle() {
      switch (this.listType) {
        case 'all':
          return '所有任务'
        case 'processing':
          return '正在进行'
        case 'done':
          return '已完成'
      }
    },
    listEmpty() {
      switch (this.listType) {
        case 'all':
          return '开始添加任务吧'
        case 'processing':
          return '没有正在处理的任务'
        case 'done':
          return '还没有完成任何任务'
      }
    },
    dateFilterLabel() {
      switch (this.dateFilter) {
        case 'all':
          return '所有时间'
        case 'today':
          return '今天'
        case 'tomorrow':
          return '明天'
        case 'thisWeek':
          return '本周'
        case 'nextWeek':
          return '下周'
        case 'after':
          return '以后'
        case 'expired':
          return '已延误'
        case 'noDeadline':
          return '没有截至时间'
      }
    },
    list() {
      if (this.dateFilter === 'all') {
        return this.taskList
      }
      switch (this.dateFilter) {
        case 'today':
          return this.taskGroup.today
        case 'tomorrow':
          return this.taskGroup.tomorrow
        case 'thisWeek':
          return this.taskGroup.thisWeek
        case 'nextWeek':
          return this.taskGroup.nextWeek
        case 'after':
          return this.taskGroup.after
        case 'expired':
          return this.taskGroup.expired
        case 'noDeadline':
          return this.taskGroup.noDeadline
      }
    },
    ...mapGetters([
      'taskDateFilter',
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
      this.listType = this.$route.params.listType
      this.dateFilter = this.taskDateFilter
      this.getTask()
    }
  },
  created() {
    this.project.id = this.$route.params.id
    this.project.name = this.$route.params.name
    this.listType = this.$route.params.listType
    this.dateFilter = this.taskDateFilter
    this.init()
  },
  methods: {
    init() {
      this.getTask()
    },
    getTask() {
      let done
      if (this.listType === 'processing') {
        done = 0
      } else if (this.listType === 'done') {
        done = 1
      }
      taskService.getList(this.project.id, done).then(res => {
        this.taskList = res.data.data
        this.setTaskGroup()
      })
    },
    createTask() {
      if (this.task.title === '') {
        return
      }
      let task = {}
      task.title = this.task.title
      if (this.task.deadline) {
        task.deadline = this.task.deadline
      }
      if (this.assigneeId) {
        task.user_id = this.assigneeId
      }
      task.team_id = this.currentTeam.id
      task.project_id = this.project.id

      let event = {}
      event.type = taskEvent.create
      event.event = taskEvent.createText
      event.user_id = this.currentUser.id

      taskService.add(task, event).then(res => {
        this.task.title = ''
        this.getTask()
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
    handleTaskCheck(item) {
      let task = {}
      task.done = item.done
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
      taskService.update(item.id, task, event).then(res => {
        console.log(res.data)
      })
    },
    handleTaskClick(item) {
      this.$router.push({
        name: 'project-task',
        params: {
          id: this.project.id,
          name: this.project.name,
          taskId: item.id
        }
      })
    },
    handleDateFilter(name) {
      this.dateFilter = name
      this.setTaskDateFilter(name)
    },
    setTaskGroup() {
      this.taskGroup.today = []
      this.taskGroup.tomorrow = []
      this.taskGroup.thisWeek = []
      this.taskGroup.nextWeek = []
      this.taskGroup.after = []
      this.taskGroup.expired = []
      this.taskGroup.noDeadline = []
      for (const task of this.taskList) {
        if (!task.deadline) {
          this.taskGroup.noDeadline.push(task)
          continue
        }
        if (util.timeBeforeToday(task.deadline)) {
          this.taskGroup.expired.push(task)
          continue
        }
        if (util.timeEqualToday(task.deadline)) {
          this.taskGroup.today.push(task)
          this.taskGroup.thisWeek.push(task)
          continue
        }
        if (util.timeEqualTomorrow(task.deadline)) {
          this.taskGroup.tomorrow.push(task)
          this.taskGroup.thisWeek.push(task)
          continue
        }
        if (util.timeInThisWeek(task.deadline)) {
          this.taskGroup.thisWeek.push(task)
          continue
        }
        if (util.timeInNextWeek(task.deadline)) {
          this.taskGroup.nextWeek.push(task)
          continue
        }
        this.taskGroup.after.push(task)
      }
    },
    taskExpired(date) {
      return util.timeBeforeToday(date)
    },
    stop() { },
    ...mapMutations([
      'setTaskDateFilter'
    ])
  }
}
</script>

<style>

</style>
