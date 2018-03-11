import http from '../index'
import url from '../url'

/**
 * 团队相关 Api
 */
class TeamService {
  /**
   * 获取所有用户和组
   * @param   {Number}   teamId 团队id
   * @return  {users, groups} 用户,组
   */
  getAllUsersAndGroups(teamId) {
    return http.get(url.user, {
      teamId,
      status: 1
    })
  }

  /**
   * 获取所有组
   * @param   {Number} teamId  团队id
   * @return  {Object[]} 组
   */
  getAllGroups(teamId) {
    return http.get(url.group, { teamId })
  }

  /**
   * 删除组
   * @param {Number} groupId 组id
   */
  deleteGroup(groupId) {
    return http.delete(url.group_delete.replace(':id', groupId))
  }
  /**
   * 从团队中移除用户
   * @param  {Number}  teamId  团队id
   * @param  {Number}  userId  用户id
   */
  deleteUser(teamId, userId) {
    return http.delete(
      url.team_remove_user.replace(':teamId', teamId).replace(':userId', userId)
    )
  }
}

export default new TeamService()
