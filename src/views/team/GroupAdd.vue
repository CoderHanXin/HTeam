<template>
  <Modal v-model="visable" :loading="modalLoading" @on-ok="handleOk" @on-cancel="handleCancel" :title="modalTitle" :mask-closable="false" width="480">
    <Form ref="groupAddForm" :model="group" :rules="rules" :label-width="80">
      <FormItem label="分组名称" prop="name">
        <Input type="text" v-model.trim="group.name" :maxlength="20" placeholder="请输入分组名称" />
      </FormItem>
      <FormItem label="选择成员">
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">所有人</Checkbox>
        <CheckboxGroup v-model="checkedUsers" @on-change="handleCheckGroupChange">
          <Checkbox v-for="item in users" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import teamService from '@/api/services/team'
export default {
  name: 'GroupAdd',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    teamId: Number,
    users: Array
  },
  data() {
    return {
      visable: this.value,
      modalLoading: true,
      modalTitle: '新建成员分组',
      indeterminate: false,
      checkAll: false,
      checkedUsers: [],
      group: {
        name: ''
      },
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
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.group.name = ''
      this.checkedUsers = []
      this.indeterminate = false
    },
    handleCheckGroupChange(data) {
      if (data.length === this.allUsers.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
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
      this.$refs.groupAddForm.validate(valid => {
        if (valid) {
          let group = {}
          group.name = this.group.name
          group.teamId = this.teamId
          teamService.createGroup(group, this.checkedUsers).then(res => {
            this.$emit('onGroupAddOk')
            this.$emit('input', false)
          })
        }
      })
    },
    handleCancel() {
      this.$emit('onGroupAddCancel')
      this.$emit('input', false)
    }
  }
}
</script>

<style>

</style>
