import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
import Cookies from 'js-cookie'
import iView from 'iview'
import { oneOf, setTitle } from '../common/utils/util'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  base: '/hteam/',
  routes: routers
}

const freeAccess = ['login', 'register', 'join']

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  setTitle(to.meta.title)
  if (oneOf(to.name, freeAccess)) {
    next()
  } else {
    if (!Cookies.get('token')) {
      next({
        name: 'login'
      })
    } else {
      if (!Cookies.getJSON('currentUser')) {
        next({
          name: 'login'
        })
      } else {
        next()
      }
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
