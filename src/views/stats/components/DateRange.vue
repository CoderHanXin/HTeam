<template>
  <div class="wrapper" :style="{'font-size': size + 'px'}">
    <div @click="back">
      <Icon class="arrow" size="16" type="ios-arrow-back"></Icon>
    </div>
    <div class="date">
      <span>{{startLabel}}</span>
      <span>-</span>
      <span>{{endLabel}}</span>
    </div>
    <div @click="forward">
      <Icon class="arrow" size="16" type="ios-arrow-forward"></Icon>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const firstDayOfWeek = moment(moment().weekday(0).format('YYYY-MM-DD')).toDate()
const lastDayOfWeek = moment(moment().weekday(6).format('YYYY-MM-DD')).toDate()
export default {
  name: 'DateRange',
  props: {
    size: {
      type: Number,
      default: 14
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      start: null,
      end: null
    }
  },
  computed: {
    startLabel() {
      return this.start ? moment(this.start).format('MM-DD') : ''
    },
    endLabel() {
      return this.end ? moment(this.end).format('MM-DD') : ''
    }
  },
  created() {
    this.start = this.value[0] ? this.value[0] : firstDayOfWeek
    this.end = this.value[1] ? this.value[1] : lastDayOfWeek
  },
  methods: {
    back() {
      this.start = moment(this.start).subtract(7, 'days').toDate()
      this.end = moment(this.end).subtract(7, 'days').toDate()
      this.$emit('on-change', this.start, this.end)
    },
    forward() {
      this.start = moment(this.start).add(7, 'days').toDate()
      this.end = moment(this.end).add(7, 'days').toDate()
      this.$emit('on-change', this.start, this.end)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'

.wrapper
  display flex
  align-items center
  color $color-grey
.arrow
  padding 6px
  cursor pointer
  &:hover
    color $color-primary
.date
  padding 0 4px
</style>

