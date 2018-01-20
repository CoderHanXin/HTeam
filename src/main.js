import Vue from 'vue'
import App from './App'
import { router } from './router/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './style/index.styl'
import http from './api'

Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$http = http

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
