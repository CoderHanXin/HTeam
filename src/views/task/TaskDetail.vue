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
      <!-- <div class="header">
        <div class="title">task detail</div>
      </div> -->
      <Content class="content">
        <div class="task-detail">
          <div class="task-detail-header">
            <Checkbox @on-change="handleTaskCheck()" v-model="task.done" :true-value="1" :false-value="0" :size="'large'"></Checkbox>
            <div class="title">
              <span>任务001任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长</span>
            </div>
          </div>
          <div class="task-detail-content">
            <div class="task-detail-info">
              <div class="info-item">
                <Dropdown trigger="click" placement="bottom">
                  <a class="link-text">{{task.user ? task.user.name : '未指派'}}</a>
                  <DropdownMenu slot="list">
                    <DropdownItem v-if="isAssigned" :name="-1">未指派</DropdownItem>
                    <DropdownItem v-for="(item, index) in allUsers" :divided="isAssigned && index===0" :key="item.id" :name="item.id">{{item.name}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div class="info-item">
                <DatePicker @on-change="datePickerChange" @on-clear="datePickerClear" @on-ok="datePickerOk" :open="isDatePickerOpen" :value="task.deadline" :options="dateOptions" confirm type="date" format="yyyy-MM-dd" placement="bottom">
                  <a class="link-text deadline" @click="datePickerClick" v-show="!isDateSelected">没有截止时间</a>
                  <a class="link-text deadline" @click="datePickerClick" v-show="isDateSelected">{{deadlineLabel | deadline}}</a>
                </DatePicker>
              </div>
              <div class="info-item">
                <Dropdown trigger="click" placement="bottom">
                  <a class="link-text">
                    <Icon class="level-icon-off" type="alert"></Icon>
                    <Icon class="level-icon-off" type="alert"></Icon>
                    <Icon class="level-icon-off" type="alert"></Icon>
                    正常处理
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      有空再看
                    </DropdownItem>
                    <DropdownItem>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      正常处理
                    </DropdownItem>
                    <DropdownItem>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-off" type="alert"></Icon>
                      优先处理
                    </DropdownItem>
                    <DropdownItem>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      <Icon class="level-icon-on" type="alert"></Icon>
                      十万火急
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div class="info-item right">
                <Button type="primary" shape="circle" size="small">编辑</Button>
                <Button type="error" shape="circle" size="small">删除</Button>
              </div>
            </div>
            <div class="task-detail-desc">这里是任务描述1234</div>
          </div>
          <div class="task-detail-events">
            <ul>
              <li class="task-detail-event-item">
                <div class="event-icon">
                  <Icon size="32" type="plus-circled"></Icon>
                </div>
                <span class="event-text">02-14 14:14</span>
                <span class="event-text">老韩</span>
                <span class="event-text">创建了任务</span>
              </li>
              <li class="task-detail-event-item">
                <div class="event-icon">
                  <Icon size="32" type="information-circled"></Icon>
                </div>
                <span class="event-text">02-16 16:16</span>
                <span class="event-text">老韩</span>
                <span class="event-text">更新了任务</span>
              </li>
              <li class="task-detail-event-item">
                <div class="event-icon">
                  <Icon size="32" type="checkmark-circled"></Icon>
                </div>
                <span class="event-text">02-18 18:18</span>
                <span class="event-text">老韩</span>
                <span class="event-text">完成了任务</span>
              </li>
            </ul>
          </div>
          <div class="task-detail-comments">
            <ul>
              <li class="task-detail-comment-item">
                <div class="comment-icon">
                  <Avatar style="background:#5cadff" size="large">老韩</Avatar>
                </div>
                <div class="comment-box">
                  <div class="comment-meta">
                    <span>老韩</span>
                    <span>
                      <Icon type="ios-clock-outline"></Icon>
                      02-18 18:18</span>
                  </div>
                  <div class="comment-content">这个任务的评论需要仔细斟酌一下</div>
                </div>
              </li>
              <li v-for="item in task.comments" :key="item.id" class="task-detail-comment-item">
                <div class="comment-icon">
                  <Avatar style="background:#5cadff" size="large">{{item.user.name.substr(-2)}}</Avatar>
                </div>
                <div class="comment-box">
                  <div class="comment-meta">
                    <span>{{item.user.name}}</span>
                    <span>
                      <Icon type="ios-clock-outline"></Icon>
                      {{item.created_at}}</span>
                  </div>
                  <div class="comment-content">{{item.content}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="editor-wrapper">
            <div class="editor">
              <textarea v-model="comment" @keyup.enter="submitComment" class="editor-textarea" rows="4" placeholder="在此输入评论内容，按回车键（Enter）提交"></textarea>
            </div>
            <div class="toolbar">
              <div @click="submitComment" class="editor-submit" title="提交">
                <Icon size="14" type="ios-redo"></Icon>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import taskService from '@/api/services/task'
import teamService from '@/api/services/team'
import projectService from '@/api/services/project'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'TaskDetail',
  data() {
    return {
      project: {
        id: '',
        name: ''
      },
      taskId: -1,
      task: {
        deadline: '',
        done: 0,
        user: {}
      },
      comment: '',
      deadlineLabel: '',
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      isDatePickerOpen: false
    }
  },
  computed: {
    isDateSelected() {
      return this.deadlineLabel && true
    },
    isAssigned() {
      if (!this.task.user) {
        return false
      }
      if (!this.task.user.name) {
        return false
      }
      return true
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
    handleTaskCheck() {

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
    datePickerClick() {
      this.isDatePickerOpen = !this.isDatePickerOpen
    },
    datePickerChange(date) {
      this.task.deadline = date
      if (this.task.deadline === '') {
        this.deadlineLabel = this.task.deadline
      }
    },
    datePickerClear() {
      this.isDatePickerOpen = false
    },
    datePickerOk() {
      this.deadlineLabel = this.task.deadline
      this.isDatePickerOpen = false
    },
    ...mapMutations([
      'setAllUsers',
      'setAllGroups'
    ])
  }
}
</script>

<style lang="stylus" scoped>
.level-icon-on
  color #ed3f14
.level-icon-off
  color #ccc
</style>

