<template>
  <Card shadow>
    <div class="card-header">
      <div class="card-header-title">
        <span>任务统计</span>
      </div>
    </div>
    <div class="card-body">
      <div class="flex-cell border-right">
        <div class="gauge">
          <chart :options="doneGauge"></chart>
        </div>
        <div class="gauge">
          <div class="gauge">
            <chart :options="expiredGauge"></chart>
          </div>
        </div>
      </div>
      <div class="flex-cell">
        <div class="stats-item">
          <p class="stats-item-label">进行中</p>
          <p class="stats-item-number grey">{{processing}}</p>
        </div>
        <div class="stats-item">
          <p class="stats-item-label">延误</p>
          <p class="stats-item-number red">{{expired}}</p>
        </div>
        <div class="stats-item">
          <p class="stats-item-label">已完成</p>
          <p class="stats-item-number green">{{done}}</p>
        </div>
        <div class="stats-item">
          <p class="stats-item-label">任务总数</p>
          <p class="stats-item-number grey">{{all}}</p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/line'
import getGauge from '../echarts/gauge'
export default {
  name: 'TaskStats',
  components: {
    chart: ECharts
  },
  props: {
    all: {
      type: Number,
      default: 0,
      required: true
    },
    done: {
      type: Number,
      default: 0,
      required: true
    },
    expired: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      doneGauge: getGauge(),
      expiredGauge: getGauge()
    }
  },
  computed: {
    processing() {
      return this.all - this.done
    },
    doneRate() {
      return (this.done * 100 / this.all).toFixed()
    },
    expiredRate() {
      return (this.expired * 100 / this.all).toFixed()
    }
  },
  watch: {
    doneRate(val) {
      this.doneGauge.series[0].data[0].value = val
    },
    expiredRate(val) {
      this.expiredGauge.series[0].data[0].value = val
    }
  },
  created() {
    this.doneGauge.series[0].data[0].name = '完成率'
    this.expiredGauge.series[0].data[0].name = '延期率'
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
@import '~@/style/common'
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
</style>
