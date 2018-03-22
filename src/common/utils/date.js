'use strict'

const moment = require('moment')
moment.locale('zh-cn', {
  week: {
    dow: 1 // Monday is the first day of the week.
  }
})

let date = {}

date.timeBeforeToday = function(t) {
  const m = moment(t)
  const today = moment(moment().format('YYYY-MM-DD'))
  const diff = m.diff(today)

  return diff < 0
}

date.timeEqualToday = function(t) {
  const m = moment(t).format('YYYY-MM-DD')
  const today = moment().format('YYYY-MM-DD')
  return m === today
}

date.timeEqualTomorrow = function(t) {
  const m = moment(t).format('YYYY-MM-DD')
  const tomorrow = moment()
    .add(1, 'days')
    .format('YYYY-MM-DD')
  return m === tomorrow
}

date.timeInThisWeek = function(t) {
  const m = moment(moment(t).format('YYYY-MM-DD'))
  const thisSunday = moment(
    moment()
      .weekday(6)
      .format('YYYY-MM-DD')
  )
  const diff = m.diff(thisSunday)
  return diff <= 0
}

date.timeInNextWeek = function(t) {
  const m = moment(moment(t).format('YYYY-MM-DD'))
  const nextSunday = moment(
    moment()
      .weekday(13)
      .format('YYYY-MM-DD')
  )
  const diff = m.diff(nextSunday)
  return diff <= 0
}

date.getThisWeekRange = function() {
  const start = moment(
    moment()
      .weekday(0)
      .format('YYYY-MM-DD')
  ).toDate()
  const end = moment(
    moment()
      .weekday(6)
      .format('YYYY-MM-DD')
  ).toDate()
  return { start, end }
}

date.getLastMonthRange = function() {
  let today = moment(moment().format('YYYY-MM-DD'))
  const start = today.subtract(1, 'months').toDate()
  today = moment(moment().format('YYYY-MM-DD'))
  const end = today.toDate()
  return { start, end }
}

/**
 * 获取区间日期数组
 * @param {Date} start 开始时间
 * @param {Date} end   截止时间
 */
date.getDateRangeArray = function(start, end) {
  let list = []
  let startDate = moment(moment(start).format('YYYY-MM-DD'))
  let endDate = moment(moment(end).format('YYYY-MM-DD'))
  while (startDate.diff(endDate) <= 0) {
    list.push(startDate.format('YYYY-MM-DD'))
    startDate.add(1, 'days')
  }
  return list
}

/**
 * 分组统计每日任务数
 * @param {Array} array 任务列表
 * @param {Array} range 日期数组
 */
date.groupByDateRange = function(array, range) {
  let list = new Array(range.length)
  list.fill(0)
  let operateDate
  for (const item of array) {
    operateDate = moment(item.operateTime).format('YYYY-MM-DD')
    for (let index = 0; index < range.length; index++) {
      if (operateDate === range[index]) {
        list[index]++
        break
      }
    }
  }
  return list
}

export default date
