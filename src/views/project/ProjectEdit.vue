<template>
  <div v-show="visable">
    <Modal v-model="visable" :loading="modalLoading" @on-ok="handleOk" @on-cancel="handleCancel" :title="modalTitle" :mask-closable="false" width="480">
      <Form ref="projectEditForm" :model="editProject" :rules="rules" :label-width="80">
        <FormItem label="项目名称" prop="name">
          <Input type="text" v-model="editProject.name" :maxlength="20" />
        </FormItem>
        <FormItem label="项目描述" prop="desc">
          <Input type="textarea" v-model="editProject.desc" :rows="3" :maxlength="200" />
        </FormItem>
        <FormItem label="项目成员">
          <CheckboxGroup v-model="checkedGroups" @on-change="handleCheckGroupsChange">
            <Checkbox :label="'all'">所有人</Checkbox>
            <Checkbox v-for="(item, index) in groups" :key="index" :label="index">{{item.name}}</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup v-model="checkedUsers" @on-change="handleCheckUsersChange">
            <Checkbox v-for="item in users" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import projectService from '@/api/services/project'
export default {
  name: 'ProjectEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    project: {
      required: true
    },
    projectUsers: {
      type: Array,
      default: []
    },
    groups: Array,
    users: Array
  },
  data() {
    return {
      visable: this.value,
      modalLoading: true,
      modalTitle: '项目设置',
      checkedUsers: this.projectUsers,
      checkedGroups: [],
      oldCheckedGroups: [],
      editProject: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }]
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
    },
    groupUserIds() {
      let list = []
      for (const group of this.groups) {
        let ids = []
        for (const user of group.users) {
          ids.push(user.id)
        }
        list.push(ids)
      }
      return list
    },
    checkedAllGroups() {
      let list = ['all']
      for (let index = 0; index < this.groups.length; index++) {
        list.push(index)
      }
      return list
    }
  },
  watch: {
    value(val) {
      this.visable = val
    },
    project(val) {
      this.editProject.id = val.id
      this.editProject.name = val.name
      this.editProject.desc = val.desc
    },
    projectUsers(val) {
      this.checkedUsers = val
      this.handleCheckUsersChange(val)
    }
  },
  methods: {
    handleCheckGroupsChange(data) {
      // 保存本次选择的组
      let old = [...this.oldCheckedGroups]
      this.oldCheckedGroups = [...data]
      // 选择或取消所有人
      if (data.includes('all') && !old.includes('all')) {
        this.checkedUsers = [...this.allUsers]
        this.checkedGroups = [...this.checkedAllGroups]
        return
      }
      if (!data.includes('all') && old.includes('all')) {
        this.checkedUsers = []
        this.checkedGroups = []
        return
      }
      // 循环判断各组
      for (let index = 0; index < this.groups.length; index++) {
        // 选择或取消组
        if (data.includes(index) && !old.includes(index)) {
          this.checkedUsers = Array.from(
            new Set([...this.checkedUsers, ...this.groupUserIds[index]])
          )
        } else if (!data.includes(index) && old.includes(index)) {
          for (const userId of this.groupUserIds[index]) {
            let i = this.checkedUsers.indexOf(userId)
            while (i !== -1) {
              this.checkedUsers.splice(i, 1)
              i = this.checkedUsers.indexOf(userId)
            }
          }
        }
      }

      this.handleCheckUsersChange(this.checkedUsers)
    },
    handleCheckUsersChange(data) {
      if (data.length === this.allUsers.length) {
        this.checkedGroups = [...this.checkedAllGroups]
      } else if (data.length === 0) {
        this.checkedGroups = []
      } else {
        for (let index = 0; index < this.groups.length; index++) {
          let i = this.checkedGroups.indexOf(index)
          let some = this.isInclueds(data, this.groupUserIds[index])
          if (some) {
            if (i === -1) {
              this.checkedGroups = [...this.checkedGroups, index]
            }
          } else {
            if (i !== -1) {
              this.checkedGroups.splice(i, 1)
            }
          }
        }
      }

      this.oldCheckedGroups = [...this.checkedGroups]
    },
    isInclueds(a, b) {
      if (a.length < b.length) {
        return false
      }
      let aStr = a.toString()
      for (const item of b) {
        if (aStr.indexOf(item) === -1) {
          return false
        }
      }
      return true
    },
    handleOk() {
      this.$refs.projectEditForm.validate(valid => {
        if (valid) {
          let project = {}
          project.name = this.editProject.name
          project.desc = this.editProject.desc
          projectService
            .update(this.project.id, project, this.checkedUsers)
            .then(res => {
              this.visable = false
              this.$refs.projectEditForm.resetFields()
              this.checkedUsers = []
              this.$emit('onProjectEditOk')
            })
        }
      })
    },
    handleCancel() {
      this.$refs.projectEditForm.resetFields()
      this.checkedUsers = []
      this.$emit('onProjectEditCancel')
    }
  }
}
</script>


<style>

</style>
