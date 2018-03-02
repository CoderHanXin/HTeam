<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
        <DateRange @on-change="handleRangeChange"></DateRange>
      </div>
    </div>
    <Content class="content">
      <TaskStats :processing="summary.processing" :done="summary.done" :expired="summary.expired"></TaskStats>
      <Card class="margin-top-16" shadow>
        <Collapse v-model="collapseKeys" class="task-groups">
          <Panel v-for="(project, index) in list" :key="index" class="task-group-item">
            {{project.name}}
            <ul slot="content">
              <li v-for="item in project.tasks" :key="item.id" class="task-item">
                <Card :bordered="false" :padding="0">
                  <div class="task-item-wrapper">
                    <div class="task-item-body">
                      <Checkbox @on-change="handleTaskCheck(item)" v-model="item.done" :true-value="1" :false-value="0" :size="'large'" class="task-check"></Checkbox>
                      <div @click="handleTaskClick(item)" class="task-item-title">
                        <span :class="{'task-done': item.done}">{{item.title}}</span>
                      </div>
                      <div class="task-item-meta">
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
  </Layout>
</template>

<script>
import moment from 'moment'
import statsService from '@/api/services/stats'
import DateRange from './components/DateRange'
import TaskStats from './components/TaskStats'
import util from '../../libs/util'
import { mapGetters } from 'vuex'
export default {
  name: 'StatsWeekly',
  components: {
    DateRange,
    TaskStats
  },
  data() {
    return {
      mainTitle: '任务周报',
      summary: {
        processing: 0,
        done: 0,
        expired: 0
      },
      start: null,
      end: null,
      collapseKeys: [],
      porjectList: [],
      list: []
    }
  },
  computed: {
    projectIndexs() {
      let list = []
      for (let index = 0; index < this.porjectList.length; index++) {
        list.push(index)
      }
      return list
    },
    ...mapGetters([
      'currentUser',
      'currentTeam'
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
    },
    handleRangeChange(start, end) {
      this.start = start
      this.end = end
      this.init()
    },
    getSummary() {
      statsService.getSummary(this.currentTeam.id, this.start, this.end).then(res => {
        this.summary = res.data.data
      })
    },
    getProjectsWithTasks() {
      statsService.getProjectsWithTasks(this.currentTeam.id, this.start, this.end).then(res => {
        this.porjectList = res.data.data
        this.list = [...this.porjectList]
        this.$nextTick(() => {
          this.collapseKeys = [...this.projectIndexs]
        })
      })
    },
    handleTaskCheck(item) {

    },
    handleTaskClick(item) {

    },
    taskExpired(item) {
      return item.done === 0 && util.timeBeforeToday(item.deadline)
    }
  }
}
</script>

<style lang="stylus">
.task-groups
  padding 0
.task-group-item .ivu-collapse-header
  padding-left 16px !important
.task-group-item .ivu-collapse-content
  padding 0
.task-group-item .ivu-collapse-content-box
  padding 8px 0
</style>
