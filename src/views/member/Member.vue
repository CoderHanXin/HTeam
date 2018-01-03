<template>
  <div>
    <Button @click="add" type="primary" icon="android-add">添加成员</Button>
    <Modal v-model="modal" title="添加成员" :mask-closable="false">
      <Form ref="formCustom" :model="user" :label-width="60">
        <FormItem label="姓名" prop="name">
          <Input type="text" v-model="user.name" placeholder="请输入对方真实姓名"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="user.username"  placeholder="请输入对方用户名，如Tony"></Input>
        </FormItem>
        <FormItem label="默认密码" prop="password">
          <Input type="password" v-model="user.password" placeholder="请输入默认密码"></Input>
        </FormItem>
        <FormItem label="员工编号" prop="empNumber">
          <Input type="password" v-model="user.empNumber" placeholder="请输入员工编号"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button type="primary" @click="handleSubmit('user')">添加</Button>
          <Button type="ghost" @click="handleReset('user')">重置</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'Member',
  data() {
    return {
      modal: false,
      user: {
        name: '',
        username: '',
        password: '',
        empNumber: ''
      }
    }
  },
  methods: {
    add() {
      this.modal = true
    },
    ok() {
    },
    cancel() {
    },
    handleSubmit() {
      this.$http.post('/api/user/create', this.user)
        .then(res => {
          console.log(res.data)
        })
    },
    handleReset() {
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

