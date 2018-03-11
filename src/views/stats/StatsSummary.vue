<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
      </div>
    </div>
    <Content class="content">
      <TaskStats :processing="summary.processing" :done="summary.done" :expired="summary.expired"></TaskStats>
      <Card class="margin-top-16" shadow>
        <div class="card-header">
          <div class="card-header-title">
            <span>每日新增完成任务趋势</span>
          </div>
          <div class="card-header-meta">
            <Dropdown @on-click="handTrendRangeChange" placement="bottom-end">
              <a class="link-text">
                {{trendRangeLabel}}
                <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="week">本周</DropdownItem>
                <DropdownItem name="month">最近一个月</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-line">
            <chart :options="trendLine" ref="trendLine" auto-resize></chart>
          </div>
        </div>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import statsService from '@/api/services/stats'
import date from '@/common/utils/date'
import { mapGetters } from 'vuex'
import TaskStats from './components/TaskStats'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/line'
export default {
  name: 'StatsSummary',
  components: {
    chart: ECharts,
    TaskStats
  },
  data() {
    return {
      mainTitle: '任务概况',
      summary: {
        processing: 0,
        done: 0,
        expired: 0
      },
      trendRange: {
        value: 'week',
        start: null,
        end: null
      },
      trendLine: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增任务', '完成任务']
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 30
        },
        xAxis: {
          type: 'category',
          axisTick: { alignWithLabel: true },
          data: []
        },
        yAxis: {
          type: 'value'
        },
        color: ['#2d8cf0', '#19be6b'],
        series: [{
          name: '新增任务',
          data: [],
          type: 'line',
          smooth: true
        }, {
          name: '完成任务',
          data: [],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  computed: {
    trendRangeLabel() {
      switch (this.trendRange.value) {
        case 'week':
          return '本周'
        case 'month':
          return '最近一个月'
      }
    },
    ...mapGetters([
      'currentUser',
      'currentTeam'
    ])
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      this.getSummary()
      this.getTrend()
    },
    getSummary() {
      statsService.getSummary(this.currentTeam.id).then(res => {
        this.summary = res.data.data
      })
    },
    getTrend() {
      if (this.trendRange.start === null) {
        this.setTrendRange(this.trendRange.value)
      }

      statsService.getTrend(this.currentTeam.id, this.trendRange.start, this.trendRange.end).then(res => {
        const dateList = date.getDateRangeArray(this.trendRange.start, this.trendRange.end)
        const createList = date.groupByDateRange(res.data.data.create, dateList)
        const doneList = date.groupByDateRange(res.data.data.done, dateList)
        const shortList = dateList.map(val => val.substr(-5))
        this.trendLine.xAxis.data = shortList
        this.trendLine.series[0].data = createList
        this.trendLine.series[1].data = doneList
      })
    },
    handTrendRangeChange(name) {
      this.trendRange.value = name
      this.setTrendRange(name)
      this.getTrend()
    },
    setTrendRange(name) {
      let range
      switch (name) {
        case 'week':
          range = date.getThisWeekRange()
          break
        case 'month':
          range = date.getLastMonthRange()
          break
      }
      this.trendRange.start = range.start
      this.trendRange.end = range.end
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
@import '~@/style/common'

.card-header
  display flex
  padding 0
  &-meta
    display flex
    align-items center
    flex-shrink 0
    padding-right 8px
    font-size 12px
    &-icon
      padding 6px
      cursor pointer
    &-date
      min-width 80px
      padding 0 6px
      text-align center
  &-title
    display flex
    align-items center
    flex 1
    span
      padding-left 8px
      border-left 3px solid $color-primary
.card-body
  display flex
  padding 16px
.flex-cell
  display flex
  align-items center
  justify-content space-around
  flex auto
  width 0
.gauge
  padding 0
  .echarts
    width 150px
    height 150px
.stats-item
  padding 4px
  &-label
    font-size 12px
    color $color-grey
  &-number
    font-size 32px
.chart-line
  flex 1
  .echarts
    width 100%
    height 350px
</style>

