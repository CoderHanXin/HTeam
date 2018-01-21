export default class User {
  constructor({
    id,
    username,
    name,
    phone,
    email,
    empNumber,
    desc,
    orgId,
    createTime,
    updateTime
  }) {
    this.id = id
    this.username = username
    this.name = name
    this.phone = phone
    this.email = email
    this.empNumber = empNumber
    this.desc = desc
    this.orgId = orgId
    this.createTime = createTime
    this.updateTime = updateTime
  }
}
