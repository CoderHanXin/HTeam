import Main from '@/views/Main.vue'

export const defaultRouter = { path: '/', redirect: '/login' }

export const loginRouter = {
  path: '/login',
  name: 'Login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['@/views/Login.vue'], resolve)
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
      }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [defaultRouter, loginRouter, ...appRouter]
