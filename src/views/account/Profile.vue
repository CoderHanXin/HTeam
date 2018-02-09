<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">
        <span>
          <Icon size="18" color="#2d8cf0" type="speedometer"></Icon>
        </span>
        个人设置
      </div>
    </div>
    <Content class="content">
      <Card>
        <div style="width: 400px">
          <Form ref="userForm" :model="editUser" :rules="rules" :label-width="80">
            <FormItem label="用户名" prop="username">
              <Input type="text" v-model="editUser.username" :maxlength="20" disabled/>
            </FormItem>
            <FormItem label="姓名" prop="name">
              <Input type="text" v-model="editUser.name" :maxlength="20" />
            </FormItem>
            <FormItem label="手机号" prop="phone">
              <Input type="text" v-model="editUser.phone" :maxlength="11" />
            </FormItem>
            <FormItem label="备注" prop="desc">
              <Input type="textarea" v-model="editUser.desc" :rows="3" class="user-desc" />
            </FormItem>
            <FormItem>
              <Button type="primary" style="width: 100px;" :loading="saveLoading" @click="handleSaveClick">保存</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import Cookies from 'js-cookie'
import url from '../../api/url'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Profile',
  data() {
    return {
      saveLoading: false,
      editUser: {},
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [
          {
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
    ...mapGetters([
      'currentUser'
    ])
  },
  created() {
    this.editUser = Object.assign({}, this.currentUser)
  },
  methods: {
    handleSaveClick() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          let user = {}
          user.id = this.editUser.id
          user.name = this.editUser.name
          user.phone = this.editUser.phone
          user.desc = this.editUser.desc
          this.$http
            .put(url.user_update.replace(':id', user.id), user)
            .then(res => {
              Cookies.set('currentUser', this.editUser)
              this.setCurrentUser(Object.assign({}, this.editUser))
              this.$Message.success('操作成功')
            })
        }
      })
    },
    ...mapMutations([
      'setCurrentUser'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>
