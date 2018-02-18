import http from '../index'
import url from '../url'

/**
 * 任务相关 Api
 */
class TaskService {
  /**
   * 获取任务列表
   * @param   {Number} projectId 项目id
   * @return  {Object[]}
   */
  getList(projectId, done = undefined) {
    return http.get(url.task, {
      projectId,
      done
    })
  }

  /**
   * 获取任务
   * @param   {Number} id 任务id
   * @return  {Object}
   */
  get(id) {
    return http.get(url.task_show.replace(':id', id))
  }

  /**
   * 新增任务
   * @param {Object} task 任务信息
   */
  add(task) {
    return http.post(url.task_create, task)
  }

  /**
   * 更新任务
   * @param {Number}  id    任务id
   * @param {Object}  task  任务信息
   */
  update(id, task) {
    return http.put(url.task_update.replace(':id', id), task)
  }

  /**
   * 新增任务评论
   * @param {Number}  id       任务id
   * @param {Object}  comment  评论信息
   */
  addComment(id, comment) {
    return http.post(url.task_comment_create.replace(':id', id), comment)
  }
}

export default new TaskService()
