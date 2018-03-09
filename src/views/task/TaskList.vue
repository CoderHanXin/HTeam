<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
        <div class="panel-item">
          <Select v-model="tagFilter" @on-change="handleTagFilter" clearable size="small" placeholder="标签过滤">
            <Option v-for="item in tags" :key="item.id" :value="item.id">
              <div class="select-item-flex">
                <span :style="{background: item.color}" class="select-item-color-cell margin-right-8"></span>
                {{item.name}}
              </div>
            </Option>
          </Select>
        </div>
        <div class="panel-item">
          <Select v-model="dateFilter" @on-change="handleDateFilter" clearable size="small" placeholder="时间过滤">
            <Option value="today">今天</Option>
            <Option value="tomorrow">明天</Option>
            <Option value="thisWeek">本周</Option>
            <Option value="nextWeek">下周</Option>
            <Option value="after">以后</Option>
            <Option value="expired">已延误</Option>
            <Option value="noDeadline">无截止时间</Option>
          </Select>
        </div>
      </div>
    </div>
    <Content class="content">
      <div class="task-quick-add">
        <input class="title" v-model.trim="task.title" @keydown.enter="createTask" :autofocus="true" placeholder="添加新任务，按回车键（Enter）保存" />
        <div class="meta">
          <div class="meta-item margin-right-8">
            <Select v-model="assigneeId" :label-in-value="true" :clearable="true" size="small" placeholder="未指派">
              <Option v-for="item in projectMembers" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
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
                  <div @click="handleTaskClick(item.id)" class="task-item-title">
                    <span :class="{'task-done': item.done}">{{item.title}}</span>
                  </div>
                  <div class="task-item-meta">
                    <Tag v-for="tag in item.tags" :key="tag.id" :color="tag.color">{{tag.name}}</Tag>
                    <span class="task-item-meta-label">{{item.user ? item.user.name : '未指派'}}</span>
                    <span v-if="item.deadline" class="task-item-meta-label" :class="{'task-expired':taskExpired(item)}">
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
    <Task v-model="isTaskVisable" :taskId="taskId" @onTaskCancel="handleTaskCancel"></Task>
  </Layout>
</template>

<script>
import taskService from '@/api/services/task'
import taskEvent from '../../common/constant/task_event'
import util from '../../libs/util'
import Task from './Task'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'TaskList',
  components: {
    Task
  },
  data() {
    return {
      isTaskVisable: false,
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
      taskId: 0,
      task: {
        title: '',
        deadline: ''
      },
      tagFilter: this.taskTagFilter,
      dateFilter: this.taskDateFilter,
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
    list() {
      if (this.dateFilter === '' && this.tagFilter === '') {
        return this.taskList
      }

      let tempList = this.taskList

      if (this.dateFilter !== '') {
        switch (this.dateFilter) {
          case 'today':
            tempList = this.taskGroup.today
            break
          case 'tomorrow':
            tempList = this.taskGroup.tomorrow
            break
          case 'thisWeek':
            tempList = this.taskGroup.thisWeek
            break
          case 'nextWeek':
            tempList = this.taskGroup.nextWeek
            break
          case 'after':
            tempList = this.taskGroup.after
            break
          case 'expired':
            tempList = this.taskGroup.expired
            break
          case 'noDeadline':
            tempList = this.taskGroup.noDeadline
            break
        }
      }

      let list = []
      if (this.tagFilter !== '') {
        for (const task of tempList) {
          for (const tag of task.tags) {
            if (tag.id === this.tagFilter) {
              list.push(task)
              break
            }
          }
        }
      } else {
        list = tempList
      }

      return list
    },
    ...mapGetters([
      'tags',
      'taskTagFilter',
      'taskDateFilter',
      'projectMembers',
      'currentUser',
      'currentTeam',
      'allUsers',
      'allGroups'
    ])
  },
  watch: {
    $route(to, from) {
      this.project.id = to.params.id
      this.listType = to.params.listType
      this.tagFilter = this.taskTagFilter
      this.dateFilter = this.taskDateFilter
      this.init()
    }
  },
  created() {
    this.project.id = this.$route.params.id
    this.listType = this.$route.params.listType
    this.tagFilter = this.taskTagFilter
    this.dateFilter = this.taskDateFilter
    this.init()
  },
  methods: {
    init() {
      this.getTaskList()
    },
    getTaskList() {
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
        this.getTaskList()
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
      event.task_id = item.id
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
    handleTaskClick(taskId) {
      this.taskId = taskId
      this.isTaskVisable = true
    },
    handleTaskCancel() {
      this.getTaskList()
      this.isTaskVisable = false
    },
    handleDateFilter(val) {
      this.dateFilter = val
      this.setTaskDateFilter(val)
    },
    handleTagFilter(val) {
      this.tagFilter = val
      this.setTaskTagFilter(val)
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
        if (util.timeBeforeToday(task.deadline) && task.done === 0) {
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
    taskExpired(item) {
      return item.done === 0 && util.timeBeforeToday(item.deadline)
    },
    ...mapMutations([
      'setTaskTagFilter',
      'setTaskDateFilter'
    ])
  }
}
</script>

<style>

</style>
