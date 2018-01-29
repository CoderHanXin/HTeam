import Main from '@/views/Main.vue'

export const defaultRouter = { path: '/', name: 'default', redirect: '/login' }

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('@/views/Login.vue')
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error/404.vue')
}

export const page403 = {
  path: '/403',
  name: 'error-403',
  meta: {
    title: '403-权限不足'
  },
  component: () => import('@/views/error/403.vue')
}

export const page500 = {
  path: '/500',
  name: 'error-500',
  meta: {
    title: '500-服务端错误'
  },
  component: () => import('@/views/error/500.vue')
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
        redirect: 'task/my',
        meta: {
          title: '任务'
        },
        component: () => import('@/views/task/Task.vue'),
        children: [
          {
            path: 'my',
            name: 'task-my',
            component: () => import('@/views/task/TaskMy.vue')
          },
          {
            path: 'joined',
            name: 'task-joined',
            component: () => import('@/views/task/TaskJoined.vue')
          }
        ]
      },
      {
        path: 'project',
        name: 'project',
        meta: {
          title: '项目'
        },
        component: () => import('@/views/project/Project.vue')
      },
      // {
      //   path: 'member',
      //   name: 'member',
      //   meta: {
      //     title: '成员'
      //   },
      //   component: () => import('@/views/member/Member.vue')
      // },
      {
        path: 'team',
        name: 'team',
        meta: {
          title: '团队'
        },
        component: () => import('@/views/team/Team.vue')
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
