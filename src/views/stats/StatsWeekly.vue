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
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
      'currentTeam'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getSummary()
    },
    handleRangeChange(start, end) {

    },
    getSummary() {
      statsService.getSummary(this.currentTeam.id).then(res => {
        this.summary = res.data.data
      })
    }
  }
}
</script>

<style>

</style>
