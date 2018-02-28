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
    </Content>
  </Layout>
</template>

<script>
import moment from 'moment'
import statsService from '@/api/services/stats'
import DateRange from './components/DateRange'
import TaskStats from './components/TaskStats'
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
      end: null
    }
  },
  computed: {
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
        console.log(res.data.data)
      })
    }
  }
}
</script>

<style>

</style>
