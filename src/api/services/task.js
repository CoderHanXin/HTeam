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
   * @param {Object} task  任务信息
   * @param {Object} event 事件信息
   */
  add(task, event) {
    return http.post(url.task_create, { task, event })
  }

  /**
   * 删除任务
   * @param {Number} id 任务id
   */
  delete(id) {
    return http.delete(url.task_delete.replace(':id', id))
  }

  /**
   * 更新任务
   * @param {Number}  id    任务id
   * @param {Object}  task  任务信息
   * @param {Object}  event 事件信息
   */
  update(id, task, event) {
    return http.put(url.task_update.replace(':id', id), { task, event })
  }

  /**
   * 获取任务事件
   * @param   {Number}  id  任务id
   * @return  {Object[]}
   */
  getEventList(id) {
    return http.get(url.task_show_event.replace(':id', id))
  }

  /**
   * 新增任务评论
   * @param {Number}  id       任务id
   * @param {Object}  comment  评论信息
   */
  addComment(id, comment) {
    return http.post(url.task_comment_create.replace(':id', id), comment)
  }

  /**
   * 新增标签
   * @param {Number}  id     任务id
   * @param {Number}  tagId  标签id
   * @param {Object}  event  事件信息
   */
  addTag(id, tagId, event) {
    return http.post(url.task_add_tag.replace(':id', id), { tagId, event })
  }

  /**
   * 移除标签
   * @param {Number}  id     任务id
   * @param {Number}  tagId  标签id
   * @param {Object}  event  事件信息
   */
  removeTag(id, tagId, event) {
    return http.post(url.task_remove_tag.replace(':id', id), { tagId, event })
  }
}

export default new TaskService()
