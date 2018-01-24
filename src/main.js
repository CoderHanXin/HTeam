import Vue from 'vue'
import App from './App'
import { router } from './router/index'
import CzsIcon from './views/components/czs-icon'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './style/index.styl'
import http from './api'
import moment from 'moment'

Vue.config.productionTip = false
Vue.use(CzsIcon)
Vue.use(iView)
Vue.prototype.$http = http

Vue.filter('deadline', function(date) {
  let d = moment(date, ['YYYY-MM-DD HH:mm', moment.ISO_8601])
  if (d.hour() === 0 && d.minute() === 0 && d.second() === 0) {
    return d.format('YYYY-MM-DD')
  } else {
    return date
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
