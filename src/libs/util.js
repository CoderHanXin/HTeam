'use strict'

const moment = require('moment')

let util = {}
util.title = function(title) {
  title = title || 'HTeam'
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

export default util
