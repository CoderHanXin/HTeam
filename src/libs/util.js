'use strict'

const moment = require('moment')

let util = {}
util.title = function(title) {
  if (title) {
    title = title + ' - HTeam'
  } else {
    title = 'HTeam'
  }
  window.document.title = title
}

util.trimDate = function(date) {
  let d = moment(date, 'YYYY-MM-DD HH:mm')
  if (d.hour() === 0 && d.minute() === 0 && d.second() === 0) {
    return d.format('YYYY-MM-DD')
  } else {
    return date
  }
}

util.timeCompare = function(a, b) {
  const m1 = moment(a)
  const m2 = moment(b)
  const diff = m1.diff(m2)

  return diff >= 0
}

util.timeCompareNow = function(t) {
  const m = moment(t)
  const diff = m.diff(moment())

  return diff >= 0
}

util.timeLessThanToday = function(t) {
  const m = moment(t)
  const today = moment().format('YYYY-MM-DD')
  const diff = m.diff(moment(today))
  return diff < 0
}

util.timeEqualToday = function(t) {
  const m = moment(t).format('YYYY-MM-DD')
  const today = moment().format('YYYY-MM-DD')
  return m === today
}

util.timeEqualTomorrow = function(t) {
  const m = moment(t).format('YYYY-MM-DD')
  const tomorrow = moment()
    .add(1, 'days')
    .format('YYYY-MM-DD')
  return m === tomorrow
}

util.timeLessThanNextWeek = function(t) {
  const m = moment(t)
  const nextWeek = moment(
    moment()
      .weekday(7)
      .format('YYYY-MM-DD')
  )
  const diff = m.diff(nextWeek)
  return diff < 0
}

util.timeLessThanNextMonth = function(t) {
  const m = moment(t)
  const nextMonth = moment().add(1, 'month')
  const firstDay = moment([nextMonth.year(), nextMonth.month(), 1])
  const diff = m.diff(firstDay)
  return diff < 0
}

util.taskSortIdDesc = function(a, b) {
  return -(a.id - b.id)
}

util.taskSortCompleteTimeDesc = function(a, b) {
  const m1 = moment(a.completeTime)
  const m2 = moment(b.completeTime)
  const diff = m1.diff(m2)
  return diff
}

util.taskSortUpdateTimeDesc = function(a, b) {
  if (!a.updateTime && !b.updateTime) {
    return -(a.id - b.id)
  }
  if (a.updateTime && !b.updateTime) {
    return -1
  }
  if (!a.updateTime && b.updateTime) {
    return 1
  }
  const m1 = moment(a.updateTime)
  const m2 = moment(b.updateTime)
  const diff = m1.diff(m2)
  if (diff > 0) {
    return -1
  } else if (diff < 0) {
    return 1
  } else {
    return -(a.id - b.id)
  }
}

util.taskSortDeadlineDesc = function(a, b) {
  if (!a.deadline && !b.deadline) {
    return -(a.id - b.id)
  }
  if (a.deadline && !b.deadline) {
    return -1
  }
  if (!a.deadline && b.deadline) {
    return 1
  }
  const m1 = moment(a.deadline)
  const m2 = moment(b.deadline)
  const diff = m1.diff(m2)
  if (diff > 0) {
    return -1
  } else if (diff < 0) {
    return 1
  } else {
    return -(a.id - b.id)
  }
}

util.taskSortDeadlineAsc = function(a, b) {
  if (!a.deadline && !b.deadline) {
    return -(a.id - b.id)
  }
  if (a.deadline && !b.deadline) {
    return -1
  }
  if (!a.deadline && b.deadline) {
    return 1
  }
  const m1 = moment(a.deadline)
  const m2 = moment(b.deadline)
  const diff = m1.diff(m2)
  if (diff === 0) {
    return -(a.id - b.id)
  } else {
    return diff
  }
}

export default util
