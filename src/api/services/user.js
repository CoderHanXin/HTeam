import http from '../index'
import url from '../url'

/**
 * 用户相关 Api
 */
class UserService {
  /**
   * 登录
   * @param   {String}  email     用户邮箱
   * @param   {String}  password  用户密码
   * @param   {String}  name      用户名字
   * @return  {Object}  用户信息
   */
  register(email, password, name) {
    return http.post(url.account_register, {
      email,
      password,
      name
    })
  }

  /**
   * 登录
   * @param   {String}  email     用户邮箱
   * @param   {String}  password  用户密码
   * @return  {Object}  用户信息
   */
  login(email, password) {
    return http.post(url.account_login, {
      email,
      password
    })
  }

  /**
   * 验证加入团队邀请ticket
   * @param   {String}  ticket  凭据
   * @return  {Object}  {user, team}
   */
  joinCheck(ticket) {
    return http.get(url.account_join_check.replace(':ticket', ticket))
  }

  /**
   * 加入团队
   * @param   {String}  email     用户邮箱
   * @param   {String}  password  用户密码
   * @param   {Number}  teamId    团队id
   * @param   {String}  name      用户名字
   */
  join(email, password, teamId, name) {
    return http.post(url.account_join, {
      email,
      password,
      teamId,
      name
    })
  }

  /**
   * 根据token获取用户信息
   * @return  {Object}  用户信息
   */
  show() {
    return http.get(url.user_show)
  }

  /**
   * 修改密码
   * @param   {Number}  id       用户id
   * @param   {String}  oldPass  旧密码
   * @param   {String}  newPass  新密码
   * @param   {String}  rePass   重复密码
   */
  changePassword(id, oldPass, newPass, rePass) {
    return http.put(url.user_password, {
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
