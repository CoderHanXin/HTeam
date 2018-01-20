import Vue from 'vue'
import App from './App'
import { router } from './router/index'
import CzsIcon from './views/components/czs-icon'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './style/index.styl'
import http from './api'

Vue.config.productionTip = false
Vue.use(CzsIcon)
Vue.use(iView)
Vue.prototype.$http = http

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
