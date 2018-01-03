import Main from '@/views/Main.vue'

export const defaultRouter = { path: '/', name: 'default', redirect: '/login' }

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['@/views/Login.vue'], resolve)
  }
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => {
    require(['@/views/error/404.vue'], resolve)
  }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => {
    require(['@/views/error/403.vue'], resolve)
  }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => {
    require(['@/views/error/500.vue'], resolve)
  }
}
export const appRouter = [
  {
    path: '/main',
    name: 'main',
    component: Main,
    children: [
      {
        path: 'task',
        name: 'task',
        title: '任务',
        component: resolve => {
          require(['@/views/task/Task.vue'], resolve)
        }
      },
      {
        path: 'project',
        name: 'project',
        title: '项目',
        component: resolve => {
          require(['@/views/project/Project.vue'], resolve)
        }
      },
      {
        path: 'member',
        name: 'member',
        title: '成员',
        component: resolve => {
          require(['@/views/member/Member.vue'], resolve)
        }
      }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  defaultRouter,
  loginRouter,
  ...appRouter,
  page500,
  page403,
  page404
]
