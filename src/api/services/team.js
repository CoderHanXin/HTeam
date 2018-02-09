import http from '../index'
import url from '../url'

/**
 * 团队相关 Api
 */
class TeamService {
  /**
   * 获取所有用户和组
   * @param   {String}   query.teamId 团队id
   * @param   {String}   query.name   用户姓名
   * @param   {String}   query.status 用户状态（1:正常,0:停用）
   * @return  {users, groups} 用户,组
   */
  getAllUsersAndGroups(query) {
    return http.get(url.user, query)
  }

  /**
   * 获取所有组
   * @param   {String} teamId  团队id
   * @return  {Object[]} 组
   */
  getAllGroups(teamId) {
    return http.get(url.group, { teamId })
  }
}

export default new TeamService()
