<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
      </div>
    </div>
    <Content class="content">
      <Card shadow>
        <div class="card-header">
          <span class="card-title">任务统计</span>
        </div>
        <div class="card-body">
          <div class="flex-cell border-right">
            <div class="gauge">
              <chart :options="doneGauge" ref="done"></chart>
            </div>
            <div class="gauge">
              <div class="gauge">
                <chart :options="expiredGauge" ref="expired"></chart>
              </div>
            </div>
          </div>
          <div class="flex-cell">
            <div class="stats-item">
              <p class="stats-item-label">进行中</p>
              <p class="stats-item-number grey">30</p>
            </div>
            <div class="stats-item">
              <p class="stats-item-label">延误</p>
              <p class="stats-item-number red">30</p>
            </div>
            <div class="stats-item">
              <p class="stats-item-label">已完成</p>
              <p class="stats-item-number green">30</p>
            </div>
            <div class="stats-item">
              <p class="stats-item-label">任务总数</p>
              <p class="stats-item-number grey">30</p>
            </div>
          </div>
        </div>
      </Card>
      <Card class="margin-top-16" shadow>
        <div class="card-header">
          <span class="card-title">每日新增完成任务趋势</span>
        </div>
        <div class="card-body">
          <div class="chart-line">
            <chart :options="taskLine" ref="taskLine" auto-resize></chart>
          </div>
        </div>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/line'

import getGauge from './echarts/gauge'
export default {
  name: 'StatsSummary',
  components: {
    chart: ECharts
  },
  data() {
    return {
      mainTitle: '任务概况',
      options: {
        series: [
          {
            data: [{ value: 0, name: '' }]
          }
        ]
      },
      doneGauge: getGauge(),
      expiredGauge: getGauge(),
      taskLine: {
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        color: ['#2d8cf0', '#19be6b'],
        series: [{
          name: '新增任务',
          data: [10, 20, 30, 25, 5, 40, 10],
          type: 'line',
          smooth: true
        }, {
          name: '完成任务',
          data: [20, 10, 30, 25, 15, 30, 0],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.options.series[0].data[0].value = 90
      this.options.series[0].data[0].name = '完成率'
      this.$refs.done.mergeOptions(this.options)
      this.options.series[0].data[0].value = 11
      this.options.series[0].data[0].name = '延期率'
      this.$refs.expired.mergeOptions(this.options)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
@import '~@/style/common'
.card-title
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

