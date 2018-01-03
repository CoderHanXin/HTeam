'use strict'

let util = {}
util.title = function(title) {
  title = title || 'HTeam'
  window.document.title = title
}

export default util
