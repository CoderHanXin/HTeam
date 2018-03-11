import http from '../index'
import url from '../url'

/**
 * 用户相关 Api
 */
class UserService {
  /**
   * 登录
   * @param   {String}  username  用户id
   * @param   {String}  password  用户id
   * @return  {Object}  用户信息
   */
  login(username, password) {
    return http.post(url.account_login, {
      username,
      password
    })
  }

  /**
   * 修改密码
   * @param   {Number}  id       用户id
   * @param   {String}  oldPass  旧密码
   * @param   {String}  newPass  新密码
   * @param   {String}  rePass   重复密码
   */
  changePassword(id, oldPass, newPass, rePass) {
    return http.put(url.account_change_password, {
      id,
      oldPass,
      newPass,
      rePass
    })
  }

  /**
   * 创建用户
   * @param   {Object}  user    用户信息
   * @param   {String}  teamId  团队id
   */
  create(user, teamId) {
    return http.post(url.user_create, { user, teamId })
  }

  /**
   * 修改用户信息
   * @param   {Number}  id    用户id
   * @param   {Object}  user  用户信息
   */
  update(id, user) {
    return http.put(url.user_update.replace(':id', id), user)
  }
}

export default new UserService()
