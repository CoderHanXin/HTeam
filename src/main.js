import Vue from 'vue'
import App from './App'
import { router } from './router/index'
import store from './store'
import http from './api'
import moment from 'moment'
import CzsIcon from './views/components/czs-icon'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './style/index.styl'

Vue.config.productionTip = false
Vue.use(CzsIcon)
Vue.use(iView)
Vue.prototype.$http = http

Vue.filter('deadline', function(date) {
  if (!date) {
    return '没有截止时间'
  }
  let d = moment(date, ['YYYY-MM-DD HH:mm', moment.ISO_8601])
  if (d.hour() === 0 && d.minute() === 0 && d.second() === 0) {
    return d.format('YYYY-MM-DD')
  } else {
    return d.format('YYYY-MM-DD HH:mm')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
