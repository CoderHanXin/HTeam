import http from '../index'
import url from '../url'

/**
 * 标签相关 Api
 */
class TagService {
  /**
   * 获取标签列表
   * @param   {Number}  teamId  标签id
   * @return  {Object[]}
   */
  getList(teamId) {
    return http.get(url.tag, {
      teamId
    })
  }

  /**
   * 新增标签
   * @param {Object}  tag  标签信息
   */
  add(tag) {
    return http.post(url.tag_create, tag)
  }

  /**
   * 删除标签
   * @param {Number}  id  标签id
   */
  delete(id) {
    return http.delete(url.tag_delete.replace(':id', id))
  }

  /**
   * 更新标签
   * @param {Number}  id   标签id
   * @param {Object}  tag  标签信息
   */
  update(id, tag) {
    return http.put(url.tag_update.replace(':id', id), tag)
  }
}

export default new TagService()
