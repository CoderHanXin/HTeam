<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">{{project.name}}</h5>
      </div>
      <Menu class="menu" theme="light" width="auto" @on-select="handleChangeMenu">
        <menu-item name="all">
          <Icon type="ios-folder" size="16"></Icon>
          所有任务
        </menu-item>
        <menu-item name="processing">
          <Icon type="ios-list" size="16"></Icon>
          正在进行
        </menu-item>
        <menu-item name="done">
          <Icon type="ios-pricetag" size="16"></Icon>
          已完成
        </menu-item>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div>
        <Content class="content">
          <div class="task-detail">
            <div class="task-detail-main">
              <div class="task-detail-header">
                <Checkbox @on-change="handleCheck()" v-model="task.done" :true-value="1" :false-value="0" :size="'large'"></Checkbox>
                <div class="title">
                  <span :class="{'task-done': task.done}">{{task.title}}</span>
                </div>
              </div>
              <div class="task-detail-content">
                <div class="task-detail-info">
                  <div class="info-item">
                    <span class="info-item-label">{{assignee}}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-item-label" :class="{'task-expired':taskExpired(task.deadline)}">{{task.deadline | deadline}}</span>
                  </div>
                  <div class="info-item">
                    <TaskLevel :value="task.level" />
                  </div>
                </div>
                <div class="task-detail-desc">{{task.desc}}</div>
              </div>
              <div class="task-detail-events">
                <ul>
                  <li v-for="(item, index) in task.events" v-if="showMoreEvents || index === 0 || index === task.events.length - 1" :key="item.id" class="task-detail-event-item">
                    <div class="event-icon">
                      <Icon size="32" :type="eventIcon(item.type)" :color="eventIconColor(item.type)"></Icon>
                    </div>
                    <span class="event-text">{{item.created_at | eventTime}}</span>
                    <span class="event-text">{{item.user.name}}</span>
                    <span v-html="item.event" class="event-text"></span>
                    <span v-if="item.deadline" class="event-text">{{item.deadline | deadline}}</span>
                    <a @click="showMore" v-if="!showMoreEvents && task.events.length > 2 && index === task.events.length - 1" class="link-text">（查看更多动态）</a>
                  </li>
                </ul>
              </div>
              <div class="task-detail-comments">
                <ul>
                  <li v-for="item in task.comments" :key="item.id" class="task-detail-comment-item">
                    <div class="comment-icon">
                      <Avatar style="background:#5cadff" size="large">{{item.user.name.substr(-2)}}</Avatar>
                    </div>
                    <div class="comment-box">
                      <div class="comment-meta">
                        <span>{{item.user.name}}</span>
                        <span>
                          <Icon type="ios-clock-outline"></Icon>
                          {{item.created_at | eventTime}}</span>
                      </div>
                      <div class="comment-content">{{item.content}}</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="editor-wrapper">
                <div class="editor">
                  <textarea v-model="comment" @keydown.enter="submitComment" class="editor-textarea" rows="4" placeholder="在此输入评论内容，按回车键（Enter）提交"></textarea>
                </div>
                <div class="toolbar">
                  <div @click="submitComment" class="editor-submit" title="提交">
                    <Icon size="14" type="ios-redo"></Icon>
                  </div>
                </div>
              </div>
            </div>
            <div class="task-detail-sider">
              <ul>
                <li class="task-detail-sider-item">
                  <header class="item-header">执行者
                  </header>
                  <Select v-model="assigneeId" @on-change="changeAssignee" :label-in-value="true" :clearable="true" size="small" placeholder="未指派">
                    <Option v-for="item in allUsers" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
                  </Select>
                </li>
                <li class="task-detail-sider-item">
                  <header class="item-header">截止日期
                  </header>
                  <DatePicker v-model="task.deadline" @on-change="changeDeadline" :clearable="true" :options="dateOptions" type="date" format="yyyy-MM-dd" placement="bottom" size="small" placeholder="请选择"></DatePicker>
                </li>
                <li class="task-detail-sider-item">
                  <header class="item-header">紧急程度
                  </header>
                  <Select v-model="task.level" @on-change="changeLevel" :label-in-value="true" size="small" placeholder="请选择">
                    <Option :value="0" label="有空再看">
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      有空再看</Option>
                    <Option :value="1" label="优先处理">
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      优先处理</Option>
                    <Option :value="2" label="正常处理">
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      正常处理</Option>
                    <Option :value="3" label="十万火急">
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      十万火急</Option>
                  </Select>
                </li>
                <li class="task-detail-sider-item with-border-top">
                  <Button @click="handleEdit" type="primary" shape="circle" size="small" class="margin-right-4">编辑任务</Button>
                  <Button @click="handleDelete" type="error" shape="circle" size="small">删除任务</Button>
                </li>
                <li class="task-detail-sider-item">
                </li>
              </ul>
            </div>
          </div>
        </Content>
      </div>
    </Layout>
    <Modal v-model="isTaskEditvisable" :loading="modalLoading" @on-ok="handleTaskEditOk" @on-cancel="handleTaskEditCancel" title="编辑任务" :mask-closable="false" width="480">
      <Form ref="taskEditForm" :model="editTask" :rules="rules" :label-width="80">
        <FormItem label="任务标题" prop="title">
          <Input type="textarea" v-model="editTask.title" :rows="3" :maxlength="200" class="textarea-desc" />
        </FormItem>
        <FormItem label="任务描述" prop="desc">
          <Input type="textarea" v-model="editTask.desc" :rows="5" :maxlength="1000" class="textarea-desc" />
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script>
import taskService from '@/api/services/task'
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import taskEvent from '../../common/constant/task_event'
import util from '../../libs/util'
import { mapGetters, mapMutations } from 'vuex'
import TaskLevel from '@/views/components/task-level/TaskLevel'
export default {
  name: 'TaskDetail',
  components: {
    TaskLevel
  },
  data() {
    return {
      project: {
        id: '',
        name: ''
      },
      taskId: -1,
      task: {
        title: '',
        desc: '',
        deadline: '',
        done: 0,
        user: {}
      },
      editTask: {
        title: '',
        desc: ''
      },
      showMoreEvents: false,
      isTaskEditvisable: false,
      modalLoading: true,
      comment: '',
      assigneeId: null,
      assignee: '未指派',
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      isDatePickerOpen: false,
      rules: {
        title: [{ required: true, message: '任务标题不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
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
      if (to.params.name) {
        this.project.name = to.params.name
      }
      this.taskId = this.$route.params.taskId
      this.init()
    }
  },
  created() {
    this.project.id = this.$route.params.id
    if (this.$route.params.name) {
      this.project.name = this.$route.params.name
    }
    this.taskId = this.$route.params.taskId
    this.init()
  },
  methods: {
    init() {
      this.getProject()
      this.getTask()
      if (this.allUsers.length === 0) {
        this.getUserList()
      }
    },
    getProject() {
      projectService.get(this.project.id).then(res => {
        this.project = res.data.data
      })
    },
    getTask() {
      taskService.get(this.taskId).then(res => {
        this.task = res.data.data
        if (this.task.user) {
          this.assigneeId = this.task.user.id
          this.assignee = this.task.user.name
        } else {
          this.assigneeId = null
          this.assignee = '未指派'
        }
        this.deadlineLabel = this.task.deadline
        console.log(this.task)
      })
    },
    getUserList() {
      teamService.getAllUsersAndGroups(this.currentTeam.id).then(res => {
        this.setAllUsers(res.data.data.users)
        this.setAllGroups(res.data.data.groups)
      })
    },
    handleChangeMenu(name) {
      this.activeMenuName = name
      this.$router.push({
        name: 'project-task-list',
        params: {
          id: this.project.id,
          name: this.project.name,
          listType: name
        }
      })
    },
    submitComment() {
      let comment = {}
      comment.content = this.comment
      comment.user_id = this.currentUser.id
      taskService.addComment(this.taskId, comment).then(res => {
        this.comment = ''
        this.getTask()
      })
    },
    changeAssignee(val) {
      console.log(val)
      // 如果是页面刷新，返回
      if (val.value && !val.label) {
        console.log('refresh')
        return
      }
      // 如果是页面初始化，返回
      if (this.task.user) {
        if (this.task.user.id === val.value) {
          console.log('init')
          return
        }
      }

      let task = {}
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      if (val.value) {
        task.user_id = val.value
        event.type = taskEvent.assign
        event.event = taskEvent.assignText.replace('{assignee}', val.label)
      } else {
        task.user_id = null
        event.type = taskEvent.unassign
        event.event = taskEvent.unassignText.replace('{assignee}', this.assignee)
      }
      taskService.update(this.taskId, task, event).then(res => {
        this.assignee = val.label || '未指派'
      })
    },
    changeDeadline(date) {
      let task = {}
      task.deadline = date
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      if (date) {
        event.type = taskEvent.deadline
        event.event = taskEvent.deadlineText
        event.deadline = date
      } else {
        event.type = taskEvent.noDeadline
        event.event = taskEvent.noDeadlineText
      }
      taskService.update(this.taskId, task, event).then(res => {
        this.task.deadline = date
      })
    },
    changeLevel(val) {
      console.log(val)
      // 如果是页面刷新，返回
      if (val.value && !val.label) {
        console.log('return')
        return
      }
      console.log(val)
      let task = {}
      task.level = val.value
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      event.type = taskEvent.level
      event.event = taskEvent.levelText.replace('{level}', val.label)

      taskService.update(this.taskId, task, event).then(res => {
      })
    },
    handleCheck() {
      let task = {}
      task.done = this.task.done
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      if (task.done) {
        event.type = taskEvent.done
        event.event = taskEvent.doneText
      } else {
        event.type = taskEvent.reopen
        event.event = taskEvent.reopenText
      }
      taskService.update(this.taskId, task, event).then(res => {
      })
    },
    handleEdit() {
      this.editTask.title = this.task.title
      this.editTask.desc = this.task.desc
      this.isTaskEditvisable = true
    },
    handleTaskEditOk() {
      this.$refs.taskEditForm.validate(valid => {
        if (valid) {
          let event = {}
          event.user_id = this.currentUser.id
          event.task_id = this.taskId
          event.type = taskEvent.update
          event.event = taskEvent.updateText
          taskService
            .update(this.taskId, this.editTask, event)
            .then(res => {
              this.task.title = this.editTask.title
              this.task.desc = this.editTask.desc
              this.isTaskEditvisable = false
            })
        }
      })
    },
    handleTaskEditCancel() {
      this.$refs.taskEditForm.resetFields()
    },
    handleDelete() {
      this.$Modal.confirm({
        title: `删除确认`,
        content: '确定要删除这条任务吗？',
        loading: true,
        onOk: () => {
          taskService.delete(this.taskId).then(res => {
            this.$router.go(-1)
            this.$Modal.remove()
          })
        }
      })
    },
    taskExpired(date) {
      return util.timeBeforeToday(date)
    },
    showMore() {
      this.showMoreEvents = true
    },
    eventIcon(type) {
      switch (type) {
        case 'create':
          return 'ios-plus'
        case 'done':
          return 'ios-checkmark'
        case 'reopen':
          return 'ios-refresh'
        case 'update':
          return 'ios-information'
        case 'assign':
          return 'ios-navigate'
        case 'unassign':
          return 'ios-navigate'
        case 'deadline':
          return 'ios-clock'
        case 'noDeadline':
          return 'ios-clock'
        case 'level':
          return 'ios-speedometer'
      }
    },
    eventIconColor(type) {
      switch (type) {
        case 'create':
          return '#2d8cf0'
        case 'done':
          return '#19be6b'
        case 'reopen':
          return '#ff9900'
        case 'update':
          return '#b47fd4'
        case 'assign':
          return '#2d8cf0'
        case 'unassign':
          return '#ff9900'
        case 'deadline':
          return '#b47fd4'
        case 'noDeadline':
          return '#ff9900'
        case 'level':
          return '#2d8cf0'
      }
    },
    ...mapMutations([
      'setAllUsers',
      'setAllGroups'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>

