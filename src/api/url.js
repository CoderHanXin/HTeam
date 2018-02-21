export default {
  user: '/api/user',
  account_login: '/api/account/login',
  account_change_password: '/api/account/password',

  user_create: '/api/user',
  user_update: '/api/user/:id',
  user_delete: '/api/user/:id',

  team_create: '/api/team',
  team_remove_user: '/api/team/:teamId/remove/:userId',

  group: '/api/group',
  group_create: '/api/group',
  group_update: '/api/group/:id',
  group_delete: '/api/group/:id',

  project: '/api/project',
  project_show: '/api/project/:id',
  project_create: '/api/project',
  project_update: '/api/project/:id',
  project_delete: '/api/project/:id',

  task: '/api/task',
  task_show: '/api/task/:id',
  task_create: '/api/task',
  task_update: '/api/task/:id',
  task_delete: '/api/task/:id',
  task_comment_create: '/api/task/:id/comment',
  task_inbox: '/api/task/inbox'
}
