import moment from 'moment'
moment.updateLocale('zh-cn', {
  week: {
    dow: 1 // Monday is the first day of the week.
  }
})

let deadline = date => {
  if (!date) {
    return '无截止时间'
  }
  const d = moment(date)
  const today = moment(moment().format('YYYY-MM-DD'))
  let diff = d.diff(today)
  if (diff === 0) {
    return '今天'
  }
  if (diff < 0 && diff >= -86400000) {
    return '昨天'
  }

  if (diff > 0 && diff <= 86400000) {
    return '明天'
  }
  const thisMonday = moment(
    moment()
      .weekday(0)
      .format('YYYY-MM-DD')
  )
  const thisSunday = moment(
    moment()
      .weekday(6)
      .format('YYYY-MM-DD')
  )
  if (d.diff(thisMonday) >= 0 && d.diff(thisSunday) <= 0) {
    switch (d.format('d')) {
      case '0':
        return '周日'
      case '1':
        return '周一'
      case '2':
        return '周二'
      case '3':
        return '周三'
      case '4':
        return '周四'
      case '5':
        return '周五'
      case '6':
        return '周六'
    }
  }
  const nextMonday = moment(
    moment()
      .weekday(7)
      .format('YYYY-MM-DD')
  )
  const nextSunday = moment(
    moment()
      .weekday(13)
      .format('YYYY-MM-DD')
  )
  if (d.diff(nextMonday) >= 0 && d.diff(nextSunday) <= 0) {
    switch (d.format('d')) {
      case '0':
        return '下周日'
      case '1':
        return '下周一'
      case '2':
        return '下周二'
      case '3':
        return '下周三'
      case '4':
        return '下周四'
      case '5':
        return '下周五'
      case '6':
        return '下周六'
    }
  }
  return d.format('YYYY-MM-DD')
}

let eventTime = date => {
  const d = moment(date)
  return d.format('MM-DD HH:mm')
}

export { deadline, eventTime }
