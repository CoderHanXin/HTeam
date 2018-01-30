<template>  
  <div v-if="visable">
    <Modal :value="true" @on-visible-change="onVisibleChange" :title="modalTitle" width="480" :mask-closable="false">
      <Form ref="userForm" :model="group" :rules="rules" :label-width="80">
        <FormItem label="分组名称" prop="name">
          <Input type="text" v-model="group.name" :maxlength="20" placeholder="请输入分组名称"/>
        </FormItem>
        <FormItem label="选择成员">
            <CheckboxGroup v-model="checkedUsers">
                <Checkbox v-for="item in users" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button type="primary" @click="handleSubmit()">确定</Button>
          <Button type="ghost" @click="handleCancel()">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'GroupAdd',
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    teamId: Number,
    users: Array
  },
  data() {
    return {
      modalTitle: '新建成员分组',
      checkedUsers: [],
      group: {
        name: '',
        users: []
      },
      rules: {
        name: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onVisibleChange() {},
    handleSubmit() {},
    handleCancel() {}
  }
}
</script>

<style>

</style>
