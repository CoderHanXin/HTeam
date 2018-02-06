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
          <Form ref="userForm" :model="currentUser" :rules="rules" :label-width="80">
            <FormItem label="用户名" prop="username">
              <Input type="text" v-model="currentUser.username" :maxlength="20" disabled/>
            </FormItem>
            <FormItem label="姓名" prop="name">
              <Input type="text" v-model="currentUser.name" :maxlength="20"/>
            </FormItem>
            <FormItem label="手机号" prop="phone">
              <Input type="text" v-model="currentUser.phone" :maxlength="11"/>
            </FormItem>
            <FormItem label="备注" prop="desc">
              <Input type="textarea" v-model="currentUser.desc" :rows="3" class="user-desc" />
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
export default {
  name: 'Profile',
  data() {
    return {
      saveLoading: false,
      currentUser: {},
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
  created() {
    this.currentUser = Cookies.getJSON('currentUser')
  },
  methods: {
    handleSaveClick() {}
  }
}
</script>

<style lang="stylus" scoped>

</style>
