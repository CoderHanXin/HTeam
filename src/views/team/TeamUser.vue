<template>
  <Modal v-model="visable" @on-visible-change="onVisibleChange" :title="modalTitle" :mask-closable="false" width="480">
    <Form ref="userForm" :model="user" :rules="rules" :label-width="80">
      <FormItem label="姓名" prop="name">
        <Input type="text" v-model.trim="user.name" :maxlength="20" placeholder="请输入对方真实姓名" />
      </FormItem>
      <FormItem label="邮箱" prop="email" v-if="!isEdit">
        <Input type="email" v-model.trim="user.email" :maxlength="50" placeholder="请输入对方邮箱" />
      </FormItem>
      <FormItem label="默认密码" prop="password" v-if="!isEdit">
        <Input type="password" v-model.trim="user.password" :maxlength="32" placeholder="请输入默认密码" />
      </FormItem>
      <FormItem label="手机号" prop="phone">
        <Input type="text" v-model.trim="user.phone" :maxlength="11" placeholder="请输入手机号" />
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input type="textarea" v-model.trim="user.desc" :rows="3" class="textarea-desc" />
      </FormItem>
      <FormItem v-if="isSuperAdmin && currentUser.id !== user.id" label="权限">
        <RadioGroup v-model="user.roleId">
          <Radio v-for="item in roleList" :key="item.id" :label="item.id">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="handleCancel()">取消</Button>
      <Button type="primary" size="large" :loading="okLoading" :disabled="okDisabled" @click="handleSubmit()">确定</Button>
      <Button type="error" size="large" :loading="disableLoading" :disabled="disableDisabled" @click="handleDisable()" v-if="isEdit" class="left">移除</Button>
    </div>
  </Modal>
</template>

<script>
import role from '@/common/constant/role'
import userService from '@/api/services/user'
import teamService from '@/api/services/team'
import { mapGetters } from 'vuex'
export default {
  name: 'TeamUser',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    teamId: {
      type: Number,
      required: true
    },
    teamUser: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      visable: this.value,
      okLoading: false,
      okDisabled: false,
      disableLoading: false,
      disableDisabled: false,
      roleList: role,
      originalRoleId: 0,
      user: this.teamUser,
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        phone: [
          {
            required: false,
            type: 'string',
            pattern: /^\d+$/gi,
            message: '手机号只能是数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    modalTitle() {
      return this.isEdit ? '修改成员' : '添加成员'
    },
    isSuperAdmin() {
      return this.currentTeam.team_user.role_id === 1
    },
    ...mapGetters([
      'currentUser',
      'currentTeam'
    ])
  },
  watch: {
    value(val) {
      this.visable = val
      if (val) {
        this.user = Object.assign({}, this.teamUser)
        this.originalRoleId = this.user.roleId
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.okLoading = true
          this.disableDisabled = true
          let role = this.roleList.find(val => {
            return val.id === this.user.roleId
          })
          if (!this.isEdit) {
            delete this.user.id
            delete this.user.roleId
            userService.create(this.user, this.teamId, role).then(res => {
              this.ok()
            })
          } else {
            let user = {}
            user.id = this.user.id
            user.name = this.user.name
            user.phone = this.user.phone
            user.desc = this.user.desc
            if (this.originalRoleId === this.user.roleId) {
              role = null
            }
            userService.update(user.id, user, this.teamId, role).then(res => {
              this.ok()
            })
          }
        }
      })
    },
    handleDisable() {
      this.$Modal.confirm({
        title: `确定要移除 ${this.user.name} 吗`,
        content:
          '被移除的成员，将不能再访问本团队中的项目信息，但跟他相关的数据不会被删除。',
        onOk: () => {
          this.disableLoading = true
          this.okDisabled = true
          teamService.deleteUser(this.teamId, this.user.id)
            .then(res => {
              this.ok()
            })
        }
      })
    },
    handleCancel() {
      this.visable = false
    },
    onVisibleChange(visible) {
      if (!visible) {
        this.close()
      }
    },
    ok() {
      this.$Message.success('操作成功')
      this.visable = false
      this.okLoading = false
      this.disableDisabled = false
      this.$emit('onTeamUserOk')
    },
    close() {
      this.$emit('input', false)
    },
    clearUser() {
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
      this.user.password = ''
      this.user.phone = ''
      this.user.desc = ''
    }
  }
}
</script>

<style>

</style>
