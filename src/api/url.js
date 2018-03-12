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
  task_show_event: '/api/task/:id/event',
  task_comment_create: '/api/task/:id/comment',
  task_add_tag: '/api/task/:id/addTag',
  task_remove_tag: '/api/task/:id/removeTag',

  tag: '/api/tag',
  tag_create: '/api/tag',
  tag_update: '/api/tag/:id',
  tag_delete: '/api/tag/:id',

  stats_summary: '/api/stats/summary',
  stats_trend: '/api/stats/trend',
  stats_project: '/api/stats/project',
  stats_projects_with_tasks: '/api/stats/pwt',

  upload_token: '/api/upload/token'
}
