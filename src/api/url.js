export default {
  user: '/api/user',
  user_login: '/api/user/login',
  user_create: '/api/user',
  user_update: '/api/user/:id',
  user_delete: '/api/user/:id',
  user_change_password: '/api/account/password',
  team_create: '/api/team',
  team_remove_user: '/api/team/:teamId/remove/:userId',
  group: '/api/group',
  group_create: '/api/group',
  group_update: '/api/group/:id',
  group_delete: '/api/group/:id',
  org_tree: '/api/org/tree',
  task_create: '/api/task/create',
  task_update: '/api/task/:id',
  task_inbox: '/api/task/inbox'
}
