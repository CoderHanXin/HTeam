<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
        <Select @on-change="handleUserFilter" label-in-value clearable size="small" placeholder="执行者" style="width:100px" class="margin-right-8">
          <Option v-for="item in allUsers" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</Option>
        </Select>
        <DateRange @on-change="handleRangeChange"></DateRange>
      </div>
    </div>
    <Content class="content">
      <TaskStats :processing="summary.processing" :done="summary.done" :expired="summary.expired"></TaskStats>
      <Card v-if="list.length !== 0" class="task-group margin-top-16" shadow>
        <Collapse v-model="collapseKeys">
          <Panel v-for="(project, index) in list" :key="index" class="task-group-item">
            {{project.name}}
            <ul slot="content">
              <li v-for="item in project.tasks" :key="item.id" class="task-item">
                <Card :bordered="false" :padding="0">
                  <div class="task-item-wrapper">
                    <div class="task-item-body">
                      <Checkbox @on-change="handleTaskCheck(item)" v-model="item.done" :true-value="1" :false-value="0" :size="'large'" class="task-check"></Checkbox>
                      <div @click="handleTaskClick(item.id, project)" class="task-item-title">
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
          </Panel>
        </Collapse>
      </Card>
    </Content>
    <Task v-model="isTaskVisable" :taskId="taskId" @onTaskCancel="handleTaskCancel"></Task>
  </Layout>
</template>

<script>
import moment from 'moment'
import teamService from '@/api/services/team'
import statsService from '@/api/services/stats'
import taskService from '@/api/services/task'
import taskEvent from '../../common/constant/task_event'
import DateRange from './components/DateRange'
import TaskStats from './components/TaskStats'
import date from '@/common/utils/date'
import Task from '@/views/task/Task'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'StatsWeekly',
  components: {
    DateRange,
    TaskStats,
    Task
  },
  data() {
    return {
      summary: {
        processing: 0,
        done: 0,
        expired: 0
      },
      start: null,
      end: null,
      collapseKeys: [],
      porjectList: [],
      userFilter: {
        value: '',
        label: ''
      },
      taskId: 0,
      isTaskVisable: false
    }
  },
  computed: {
    mainTitle() {
      return this.userFilter.value ? `任务周报 - ${this.userFilter.label}` : '任务周报'
    },
    projectIndexs() {
      let list = []
      for (let index = 0; index < this.porjectList.length; index++) {
        list.push(index)
      }
      return list
    },
    list() {
      let list = []
      if (this.userFilter.value === '') {
        list = this.porjectList
      } else {
        for (const project of this.porjectList) {
          let taskList = []
          for (const task of project.tasks) {
            if (task.user && task.user.id === this.userFilter.value) {
              taskList.push(task)
            }
          }
          if (taskList.length > 0) {
            list.push({
              id: project.id,
              name: project.name,
              tasks: taskList
            })
          }
        }
      }
      this.$nextTick(() => {
        this.collapseKeys = [...this.projectIndexs]
      })
      return list
    },
    ...mapGetters([
      'currentUser',
      'currentTeam',
      'allUsers'
    ])
  },
  created() {
    this.start = moment(moment().weekday(0).format('YYYY-MM-DD')).toDate()
    this.end = moment(moment().weekday(6).format('YYYY-MM-DD')).toDate()
    this.init()
  },
  methods: {
    init() {
      this.getSummary()
      this.getProjectsWithTasks()
      if (this.allUsers.length === 0) {
        this.getUserList()
      }
    },
    handleRangeChange(start, end) {
      this.start = start
      this.end = end
      this.init()
    },
    getSummary() {
      statsService.getSummary(this.currentTeam.id, this.start, this.end, this.userFilter.value).then(res => {
        this.summary = res.data.data
      })
    },
    getProjectsWithTasks() {
      statsService.getProjectsWithTasks(this.currentTeam.id, this.start, this.end).then(res => {
        this.porjectList = res.data.data
        this.$nextTick(() => {
          this.collapseKeys = [...this.projectIndexs]
        })
      })
    },
    getUserList() {
      teamService.getAllUsersAndGroups(this.currentTeam.id).then(res => {
        this.setAllUsers(res.data.data.users)
        this.setAllGroups(res.data.data.groups)
      })
    },
    handleUserFilter(val) {
      console.log(val)
      this.userFilter = val
      this.getSummary()
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
    handleTaskClick(taskId, project) {
      this.taskId = taskId
      this.setCurrentProject({
        id: project.id, name: project.name
      })
      this.setProjectMembers(project.users)
      this.isTaskVisable = true
    },
    handleTaskCancel() {
      this.init()
      this.isTaskVisable = false
    },
    taskExpired(item) {
      return item.done === 0 && date.timeBeforeToday(item.deadline)
    },
    ...mapMutations([
      'setProjectMembers',
      'setCurrentProject',
      'setAllUsers',
      'setAllGroups'
    ])
  }
}
</script>

<style lang="stylus">
</style>
