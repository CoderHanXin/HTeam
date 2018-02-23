<template>  
  <div v-show="visable">
    <Modal 
      v-model="visable" 
      :loading="modalLoading"
      @on-ok="handleOk" 
      @on-cancel="handleCancel" 
      :title="modalTitle" 
      :mask-closable="false" 
      width="480">
      <Form ref="groupEditForm" :model="editGroup" :rules="rules" :label-width="80">
        <FormItem label="分组名称" prop="name">
          <Input type="text" v-model.trim="editGroup.name" :maxlength="20" placeholder="请输入分组名称"/>
        </FormItem>
        <FormItem v-if="users" label="选择成员">
            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">所有人</Checkbox>
            <CheckboxGroup v-model="checkedUsers" @on-change="handleCheckGroupChange">
                <Checkbox v-for="item in users" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import url from '../../api/url'
export default {
  name: 'GroupEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    group: {
      required: true
    },
    groupUsers: {
      type: Array,
      default: []
    },
    users: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      visable: this.value,
      modalLoading: true,
      modalTitle: '设置成员分组',
      indeterminate: false,
      checkAll: false,
      checkedUsers: this.groupUsers,
      editGroup: this.group,
      rules: {
        name: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    allUsers() {
      let all = []
      for (const user of this.users) {
        all.push(user.id)
      }
      return all
    }
  },
  watch: {
    value(val) {
      this.visable = val
    },
    group(val) {
      this.editGroup.id = val.id
      this.editGroup.name = val.name
    },
    groupUsers(val) {
      this.checkedUsers = val
      this.setCheckAllStatus(val)
    }
  },
  methods: {
    handleCheckGroupChange(data) {
      this.setCheckAllStatus(data)
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.checkedUsers = [...this.allUsers]
      } else {
        this.checkedUsers = []
      }
    },
    handleOk() {
      this.$refs.groupEditForm.validate(valid => {
        if (valid) {
          let params = {}
          let group = {}
          group.id = this.group.id
          group.name = this.group.name
          params.group = group
          params.users = this.checkedUsers
          this.$http
            .put(url.group_update.replace(':id', group.id), params)
            .then(res => {
              this.visable = false
              this.$emit('onGroupEditOk')
            })
        }
      })
    },
    handleCancel() {
      this.$emit('onGroupEditCancel')
    },
    setCheckAllStatus(val) {
      if (val.length === this.allUsers.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (val.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    }
  }
}
</script>

<style>

</style>
