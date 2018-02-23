<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
    </div>
    <Content class="content">
      <div class="task-quick-add">
        <input class="title" v-model="task.title" @keyup.enter="createTask" :autofocus="true" placeholder="添加新任务，按回车键（Enter）保存" />
        <div class="meta">
          <div class="meta-item">
            <Select v-model="assigneeId" :label-in-value="true" :clearable="true" size="small" placeholder="未指派">
              <Option v-for="item in allUsers" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </div>
          <div class="meta-item">
            <DatePicker v-model="task.deadline" :clearable="true" :options="dateOptions" type="date" format="yyyy-MM-dd" placement="bottom-end" size="small" placeholder="截止时间"></DatePicker>
          </div>
        </div>
      </div>
      <div class="task-list">
        <ul>
          <li @click="handleTaskClick(item)" v-for="item in list" :key="item.id" class="task-item">
            <Card :bordered="false" :padding="0">
              <div class="task-item-wrapper">
                <div class="task-item-body">
                  <Checkbox @on-change="handleTaskCheck(item)" v-model="item.done" :true-value="1" :false-value="0" :size="'large'" class="task-check"></Checkbox>
                  <div class="task-item-title">
                    <span :class="{'task-done': item.done}">{{item.title}}</span>
                  </div>
                  <div class="task-item-meta">
                    <span class="task-assignee">{{item.user ? item.user.name : '未指派'}}</span>
                    <span v-if="item.deadline" class="task-label">
                      <Icon type="ios-clock-outline"></Icon>
                      {{item.deadline | deadline}}</span>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        </ul>
        <div v-if="list.length === 0" class="list-empty">{{listEmpty}}</div>
      </div>
    </Content>
  </Layout>
</template>

<script>
import taskService from '@/api/services/task'
import events from '../../common/constant/task_event'
import { mapGetters } from 'vuex'
export default {
  name: 'TaskList',
  data() {
    return {
      project: {
        id: '',
        name: ''
      },
      listType: 'all',
      list: [],
      task: {
        title: '',
        deadline: ''
      },
      assigneeId: null,
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  computed: {
    mainTitle() {
      switch (this.listType) {
        case 'all':
          return '所有任务'
        case 'processing':
          return '正在进行'
        case 'done':
          return '已完成'
      }
    },
    listEmpty() {
      switch (this.listType) {
        case 'all':
          return '开始添加任务吧'
        case 'processing':
          return '没有正在处理的任务'
        case 'done':
          return '还没有完成任何任务'
      }
    },
    ...mapGetters([
      'currentUser',
      'currentTeam',
      'allUsers',
      'allGroups'
    ])
  },
  watch: {
    $route(to, from) {
      this.project.id = to.params.id
      this.project.name = to.params.name
      this.listType = this.$route.params.listType
      this.getTask()
    }
  },
  created() {
    this.project.id = this.$route.params.id
    this.project.name = this.$route.params.name
    this.listType = this.$route.params.listType
    this.init()
  },
  methods: {
    init() {
      this.getTask()
    },
    getTask() {
      let done
      if (this.listType === 'processing') {
        done = 0
      } else if (this.listType === 'done') {
        done = 1
      }
      taskService.getList(this.project.id, done).then(res => {
        this.list = res.data.data
      })
    },
    createTask() {
      let title = this.task.title.trim()
      if (title === '') {
        return
      }
      let task = {}
      task.title = title
      if (this.task.deadline) {
        task.deadline = this.task.deadline
      }
      if (this.assigneeId) {
        task.user_id = this.assigneeId
      }
      task.project_id = this.project.id

      let event = {}
      event.type = events.create
      event.event = events.createText
      event.user_id = this.currentUser.id

      taskService.add(task, event).then(res => {
        this.getTask()
      })
    },
    handleProjectEditOk() {
      this.$Message.info('操作成功')
      this.getProject()
      this.isProjectEditVisable = false
    },
    handleProjectEditCancel() {
      this.isProjectEditVisable = false
    },
    handleProjectEditShow() {
      this.projectUsers = []
      for (const user of this.project.users) {
        this.projectUsers.push(user.id)
      }
      this.isProjectEditVisable = true
    },
    handleTaskCheck(item) {
      let task = {}
      task.done = item.done
      taskService.update(item.id, task).then(res => {
        console.log(res.data)
      })
    },
    handleTaskClick(item) {
      this.$router.push({
        name: 'project-task',
        params: {
          id: this.project.id,
          name: this.project.name,
          taskId: item.id
        }
      })
    }
  }
}
</script>

<style>

</style>
