import http from '../index'
import url from '../url'

/**
 * 项目相关 Api
 */
class ProjectService {
  /**
   * 获取项目列表
   * @param   {Number} teamId 团队id
   * @return  {Object[]}
   */
  getList(teamId) {
    return http.get(url.project, {
      teamId,
      archived: 0
    })
  }

  /**
   * 获取项目
   * @param   {Number} id 项目id
   * @return  {Object}
   */
  get(id) {
    return http.get(url.project_show.replace(':id', id))
  }

  /**
   * 新增项目
   * @param {Number}   teamId   团队id
   * @param {Object}   project  项目信息
   * @param {Number[]} users    成员id
   */
  add(teamId, project, users) {
    return http.post(url.project_create, {
      teamId,
      project,
      users
    })
  }

  /**
   * 更新项目
   * @param {Number}   id       项目id
   * @param {Object}   project  项目信息
   * @param {Number[]} users    成员id
   */
  update(id, project, users) {
    return http.put(url.project_update.replace(':id', id), {
      project,
      users
    })
  }

  /**
   * 归档项目
   * @param {Number} id 项目id
   */
  archive(id) {
    return http.put(url.project_update.replace(':id', id), {
      archived: 1
    })
  }
}

export default new ProjectService()
