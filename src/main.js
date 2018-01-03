import Vue from 'vue'
import App from './App'
import { router } from './router/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './style/index.styl'
import axiosPlugin from './api'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(axiosPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
