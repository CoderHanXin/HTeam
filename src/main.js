import Vue from 'vue'
import App from './App'
import { router } from './router/index'
import store from './store'
import http from './api'
import moment from 'moment'
import * as filters from './common/filters'
import CzsIcon from './views/components/czs-icon'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import './style/index.styl'

Vue.config.productionTip = false
Vue.use(CzsIcon)
Vue.use(iView)
Vue.prototype.$http = http
moment.locale('zh-cn')
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
