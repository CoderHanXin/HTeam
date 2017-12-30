import axios from 'axios'

let util = {}
util.title = function(title) {
  title = title || 'HTeam'
  window.document.title = title
}

const ajaxUrl = 'http://127.0.0.1:8888'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 10000
})

export default util
