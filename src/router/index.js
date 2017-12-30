import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
import iView from 'iview'
import Util from '../libs/util'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  next()
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
