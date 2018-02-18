import moment from 'moment'
let deadline = date => {
  if (!date) {
    return '没有截止时间'
  }
  const d = moment(date, ['YYYY-MM-DD HH:mm', moment.ISO_8601])
  const today = moment(moment().format('YYYY-MM-DD'))
  let diff = d.diff(today)
  if (diff === 0) {
    return '今天'
  }

  if (diff < 0) {
    if (diff >= -86400000) {
      return '昨天'
    } else {
      const lastSunday = moment(
        moment()
          .weekday(-8)
          .format('YYYY-MM-DD')
      )
      diff = d.diff(lastSunday)
      if (diff > 0) {
        switch (d.format('d')) {
          case '0':
            return '上周日'
          case '1':
            return '上周一'
          case '2':
            return '上周二'
          case '3':
            return '上周三'
          case '4':
            return '上周四'
          case '5':
            return '上周五'
          case '6':
            return '上周六'
        }
      }
      return d.format('YYYY-MM-DD')
    }
  }

  if (diff > 0 && diff <= 86400000) {
    return '明天'
  }
  const thisSunday = moment(
    moment()
      .weekday(6)
      .format('YYYY-MM-DD')
  )
  diff = d.diff(thisSunday)
  if (diff <= 0) {
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
  const nextSunday = moment(
    moment()
      .weekday(13)
      .format('YYYY-MM-DD')
  )
  diff = d.diff(nextSunday)
  if (diff <= 0) {
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

export { deadline }
