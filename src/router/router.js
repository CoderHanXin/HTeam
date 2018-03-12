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
    path: '/',
    name: 'main',
    component: Main,
    children: [
      {
        path: 'project',
        name: 'project',
        meta: {
          title: '项目'
        },
        component: () => import('@/views/project/Project.vue')
      },
      {
        path: 'project/:id/tasks',
        name: 'project-tasks',
        redirect: 'project/:id/tasks/all',
        meta: {
          title: '任务'
        },
        component: () => import('@/views/task/Tasks.vue'),
        children: [
          {
            path: ':listType',
            name: 'project-task-list',
            meta: {
              title: '任务列表'
            },
            component: () => import('@/views/task/TaskList.vue')
          }
        ]
      },
      {
        path: 'team',
        name: 'team',
        meta: {
          title: '团队'
        },
        component: () => import('@/views/team/Team.vue')
      },
      {
        path: 'stats',
        name: 'stats',
        redirect: 'stats/summary',
        meta: {
          title: '统计'
        },
        component: () => import('@/views/stats/Stats.vue'),
        children: [
          {
            path: 'summary',
            name: 'stats-summary',
            meta: {
              title: '任务概况'
            },
            component: () => import('@/views/stats/StatsSummary.vue')
          },
          {
            path: 'weekly',
            name: 'stats-weekly',
            meta: {
              title: '任务周报'
            },
            component: () => import('@/views/stats/StatsWeekly.vue')
          },
          {
            path: 'project',
            name: 'stats-project',
            meta: {
              title: '项目统计'
            },
            component: () => import('@/views/stats/StatsProject.vue')
          },
          {
            path: 'team',
            name: 'stats-team',
            meta: {
              title: '团队统计'
            },
            component: () => import('@/views/stats/StatsTeam.vue')
          }
        ]
      },
      {
        path: 'account',
        name: 'account',
        meta: {
          title: '个人中心'
        },
        component: () => import('@/views/account/Account.vue'),
        children: [
          {
            path: 'profile',
            name: 'profile',
            meta: {
              title: '个人设置'
            },
            component: () => import('@/views/account/Profile.vue')
          }
        ]
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
