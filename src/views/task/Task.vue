<template>
  <div>
    <Modal class="modal-wrapper" v-model="visable" :styles="styles" :footer-hide="true" @on-cancel="handleCancel">
      <div class="modal">
        <div class="modal-main">
          <div class="modal-header">
            <span class="title">
              <Icon class="margin-right-4" color="#2d8cf0" type="ios-folder" />{{currentProject.name}}</span>
            <div class="meta"></div>
          </div>
          <div class="modal-content">
            <div class="task">
              <div class="task-main">
                <div class="task-header">
                  <Checkbox @on-change="handleCheck()" v-model="task.done" :true-value="1" :false-value="0" :size="'large'"></Checkbox>
                  <div class="title">
                    <Input v-show="isEdit" v-model.trim="editTask.title" type="text" />
                    <span v-show="!isEdit" :class="{'task-done': task.done}">{{task.title}}</span>
                  </div>
                </div>
                <div class="task-content">
                  <div class="task-info">
                    <div class="info-item">
                      <span class="margin-right-8">{{assignee}}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-item-label" :class="{'task-expired':taskExpired(task)}">{{task.deadline | deadline}}</span>
                    </div>
                    <div>
                      <TaskLevel :value="task.level" />
                    </div>
                  </div>
                  <div :class="taskDescCls">
                    <div v-show="!isEdit">
                      <div v-show="task.desc" v-html="task.desc" class="task-desc-text" ref="descText"></div>
                      <p v-show="!task.desc" class="task-desc-placeholder">暂无详细描述</p>
                    </div>
                    <QuillEditor v-show="isEdit" class="editor-desc" v-model="editTask.desc"></QuillEditor>
                  </div>
                  <div @click="showMoreDesc" class="task-desc-show-more" v-if="isMoreDesc && !isEdit">
                    <span>{{showMoreDescText}}
                      <Icon v-if="isShowMoreDesc" type="arrow-up-c"></Icon>
                      <Icon v-else type="arrow-down-c"></Icon>
                    </span>
                  </div>
                </div>
                <Tabs v-model="tabIndex" class="task-meta border-top">
                  <TabPane label="评论" icon="chatbox-working">
                    <ul class="task-comments">
                      <li v-for="item in task.comments" :key="item.id" class="task-comment-item">
                        <div class="comment-icon">
                          <Avatar :style="{background: item.user.color || '#2d8cf0'}" size="large">{{item.user.name.substr(-2)}}</Avatar>
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
                  </TabPane>
                  <TabPane label="动态" icon="grid">
                    <ul class="task-events">
                      <li v-for="(item, index) in eventList" v-if="isShowMoreEvents || index === 0 || index === eventList.length - 1" :key="item.id" class="task-event-item">
                        <div class="event-icon">
                          <Icon size="32" :type="eventIcon(item.type)" :color="eventIconColor(item.type)"></Icon>
                        </div>
                        <span class="event-text">{{item.created_at | eventTime}}</span>
                        <span class="event-text">{{item.user.name}}</span>
                        <span v-html="item.event" class="event-text"></span>
                        <span v-if="item.deadline" class="event-text">{{item.deadline | deadline}}</span>
                        <a @click="showMoreEvents" v-if="!isShowMoreEvents && eventList.length > 2 && index === eventList.length - 1" class="link-text">（查看更多动态）</a>
                      </li>
                    </ul>
                  </TabPane>
                </Tabs>
              </div>
              <div class="task-sider">
                <ul>
                  <li class="task-sider-item">
                    <header class="item-header">执行者</header>
                    <Select :disabled="disabled" v-model="assigneeId" @on-change="changeAssignee" :label-in-value="true" :clearable="true" size="small" placeholder="未指派">
                      <Option v-for="item in projectMembers" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</Option>
                    </Select>
                  </li>
                  <li class="task-sider-item">
                    <header class="item-header">截止日期</header>
                    <DatePicker :disabled="disabled" v-model="deadline" @on-change="changeDeadline" :clearable="true" :options="dateOptions" type="date" format="yyyy-MM-dd" placement="bottom" size="small" placeholder="请选择"></DatePicker>
                  </li>
                  <li class="task-sider-item">
                    <header class="item-header">紧急程度</header>
                    <Select :disabled="disabled" v-model="level" @on-change="changeLevel" :label-in-value="true" size="small" placeholder="请选择">
                      <Option :value="0" label="有空再看">
                        <Icon class="level-icon-off" type="alert"></Icon>
                        <Icon class="level-icon-off" type="alert"></Icon>
                        <Icon class="level-icon-off" type="alert"></Icon>
                        有空再看</Option>
                      <Option :value="1" label="正常处理">
                        <Icon class="level-icon-on" type="alert"></Icon>
                        <Icon class="level-icon-off" type="alert"></Icon>
                        <Icon class="level-icon-off" type="alert"></Icon>
                        正常处理</Option>
                      <Option :value="2" label="优先处理">
                        <Icon class="level-icon-on" type="alert"></Icon>
                        <Icon class="level-icon-on" type="alert"></Icon>
                        <Icon class="level-icon-off" type="alert"></Icon>
                        优先处理</Option>
                      <Option :value="3" label="十万火急">
                        <Icon class="level-icon-on" type="alert"></Icon>
                        <Icon class="level-icon-on" type="alert"></Icon>
                        <Icon class="level-icon-on" type="alert"></Icon>
                        十万火急</Option>
                    </Select>
                  </li>
                  <li class="task-sider-item border-top padding-top-12">
                    <HtSelect v-model="tagIdList" @on-change="changeTags" multiple>
                      <div class="tag-select" slot="label">
                        <span class="label">标签</span>
                        <Icon type="android-add-circle"></Icon>
                      </div>
                      <HtOption v-for="item in tags" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</HtOption>
                    </HtSelect>
                    <ul class="tag-list">
                      <li v-if="selectedTagIdList.length === 0" class="no-data">尚未添加任何标签</li>
                      <li v-for="item in selectedTagModelList" :key="item.id" class="tag-item">
                        <Tag :name="item.id" :color="item.color" @on-close="removeTag" closable>{{item.name}}</Tag>
                      </li>
                    </ul>
                  </li>
                  <li class="task-sider-item border-top padding-top-12">
                    <Button @click="handleEdit" :type="isEdit ? 'warning' : 'primary'" shape="circle" size="small" :disabled="disabled" class="margin-right-4">{{editButtonText}}</Button>
                    <Button @click="handleDelete" type="error" shape="circle" size="small">删除任务</Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" :class="{expand: isCommentFocus}" slot="footer">
          <Avatar :style="{background: currentUser.color || '#2d8cf0'}" size="large">{{currentUser.name.substr(-2)}}</Avatar>
          <div class="comment margin-left-8">
            <textarea v-show="isCommentFocus" ref="comment" class="ht-input" v-model="comment" @keyup.ctrl.enter="submitComment" v-clickoutside="hideComment" rows="4" placeholder="评论内容(Ctrl+Enter发送)"></textarea>
            <Input v-show="!isCommentFocus" @on-focus="handleOnFocus" size="large" placeholder="评论内容(Ctrl+Enter发送)" />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import moment from 'moment'
import taskService from '@/api/services/task'
import taskEvent from '@/common/constant/task_event'
import util from '@/libs/util'
import clickoutside from '@/directives/clickoutside'
import { mapGetters } from 'vuex'
import TaskLevel from '@/views/components/task-level/TaskLevel'
import HtSelect from '@/views/components/select/Select'
import HtOption from '@/views/components/select/Option'
import QuillEditor from '@/views/components/editor/QuillEditor'
export default {
  name: 'Task',
  components: {
    TaskLevel,
    HtSelect,
    HtOption,
    QuillEditor
  },
  directives: {
    clickoutside
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      visable: this.value,
      styles: {
        maxWidth: '980px',
        width: '80%',
        height: 'calc(100vh - 120px)',
        margin: '60px auto',
        top: 0
      },
      descTextHeight: 0,
      isMoreDesc: false,
      isShowMoreDesc: false,
      isEdit: false,
      isCommentFocus: false,
      isShowMoreEvents: false,
      comment: '',
      tabIndex: 0,
      editTask: {
        title: '',
        desc: ''
      },
      task: {
        title: '',
        desc: '',
        deadline: '',
        done: 0
      },
      eventList: [],
      assigneeId: null,
      assignee: '未指派',
      deadline: null,
      level: null,
      tagIdList: [],
      selectedTagIdList: [],
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  computed: {
    disabled() {
      return this.task.done === 1
    },
    editButtonText() {
      return this.isEdit ? '保存任务' : '编辑任务'
    },
    taskDescCls() {
      if (this.isEdit) {
        return 'task-desc-expand'
      }
      if (this.isMoreDesc) {
        return this.isShowMoreDesc ? 'task-desc-expand' : 'task-desc'
      } else {
        return 'task-desc-expand'
      }
    },
    showMoreDescText() {
      return this.isShowMoreDesc ? '收起更多' : '展开更多'
    },
    selectedTagModelList() {
      let list = []
      for (const id of this.selectedTagIdList) {
        for (const tag of this.tags) {
          if (id === tag.id) {
            list.push(tag)
            break
          }
        }
      }
      return list
    },
    ...mapGetters([
      'tags',
      'currentProject',
      'projectMembers',
      'currentUser',
      'currentTeam'
    ])
  },
  watch: {
    value(val) {
      this.visable = val
      if (val) {
        this.init()
      }
    },
    descTextHeight(val) {
      if (val > 250) {
        this.isMoreDesc = true
      }
    }
  },
  methods: {
    init() {
      this.getTask()
      this.getEventList()
    },
    getTask() {
      taskService.get(this.taskId).then(res => {
        this.task = res.data.data
        this.setTagIdList()
        if (this.task.user) {
          this.assigneeId = this.task.user.id
          this.assignee = this.task.user.name
        } else {
          this.assigneeId = null
          this.assignee = '未指派'
        }
        // 将utc时间转换为Date
        this.deadline = this.task.deadline ? moment(this.task.deadline).toDate() : null
        this.level = this.task.level
        this.$nextTick(() => {
          this.descTextHeight = this.$refs.descText.offsetHeight
        })
      })
    },
    getEventList() {
      taskService.getEventList(this.taskId).then(res => {
        this.eventList = res.data.data
      })
    },
    setTagIdList() {
      this.tagIdList = []
      if (this.task.tags) {
        for (const tag of this.task.tags) {
          this.tagIdList.push(tag.id)
        }
      }
      this.selectedTagIdList = [...this.tagIdList]
    },
    handleCancel() {
      this.descTextHeight = 0
      this.isMoreDesc = false
      this.isShowMoreDesc = false
      this.isEdit = false
      this.isCommentFocus = false
      this.isShowMoreEvents = false
      this.tabIndex = 0
      this.$emit('onTaskCancel')
    },
    changeAssignee(val) {
      // 如果是页面初始化，返回
      if (this.task.user) {
        if (this.task.user.id === val.value) {
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
      // 转换为utc时间再保存
      task.deadline = date ? moment(date).utc().toDate() : null
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
        this.task.deadline = task.deadline
      })
    },
    changeLevel(val) {
      // 如果是页面初始化，返回
      if (this.task.level === val.value) {
        return
      }
      let task = {}
      task.level = val.value
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      event.type = taskEvent.level
      event.event = taskEvent.levelText.replace('{level}', val.label)

      taskService.update(this.taskId, task, event).then(res => {
        this.task.level = val.value
      })
    },
    changeTags(val) {
      if (this.selectedTagIdList.length === val.length) {
        return
      }
      let tagId
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      if (this.selectedTagIdList.length > val.length) {
        tagId = this.findChangedTag(this.selectedTagIdList, val)
        event.type = taskEvent.removeTag
        event.event = taskEvent.removeTagText.replace('{tag}', this.findTag(tagId).name)
        taskService.removeTag(this.taskId, tagId, event).then(res => {
          this.selectedTagIdList = [...val]
        })
      } else {
        tagId = this.findChangedTag(val, this.selectedTagIdList, val)
        event.type = taskEvent.addTag
        event.event = taskEvent.addTagText.replace('{tag}', this.findTag(tagId).name)
        taskService.addTag(this.taskId, tagId, event).then(res => {
          this.selectedTagIdList = [...val]
        })
      }
    },
    removeTag(e, tagId) {
      let event = {}
      event.user_id = this.currentUser.id
      event.task_id = this.taskId
      event.type = taskEvent.removeTag
      event.event = taskEvent.removeTagText.replace('{tag}', this.findTag(tagId).name)
      taskService.removeTag(this.taskId, tagId, event).then(res => {
        let index = this.selectedTagIdList.indexOf(tagId)
        this.selectedTagIdList.splice(index, 1)
      })
    },
    findChangedTag(long, short) {
      for (const i of long) {
        if (short.indexOf(i) === -1) {
          return i
        }
      }
    },
    findTag(tagId) {
      for (const tag of this.tags) {
        if (tag.id === tagId) {
          return tag
        }
      }
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
    handleDelete() {
      this.$Modal.confirm({
        title: `删除确认`,
        content: '确定要删除这条任务吗？',
        loading: true,
        onOk: () => {
          taskService.delete(this.taskId).then(res => {
            this.$Modal.remove()
            this.handleCancel()
          })
        }
      })
    },
    handleEdit() {
      if (this.isEdit) {
        if (this.task.title) {
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
              this.isEdit = false
            })
        }
      } else {
        this.editTask.title = this.task.title
        this.editTask.desc = this.task.desc
        this.isEdit = true
      }
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
    handleOnFocus() {
      this.isCommentFocus = true
      this.$nextTick(() => {
        this.$refs.comment.focus()
      })
    },
    hideComment() {
      this.isCommentFocus = false
    },
    taskExpired(task) {
      return task.done === 0 && util.timeBeforeToday(task.deadline)
    },
    showMoreDesc() {
      this.isShowMoreDesc = !this.isShowMoreDesc
    },
    showMoreEvents() {
      this.isShowMoreEvents = true
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
        case 'addTag':
          return 'ios-pricetag'
        case 'removeTag':
          return 'ios-pricetag'
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
          return '#986db2'
        case 'assign':
          return '#2d8cf0'
        case 'unassign':
          return '#ff9900'
        case 'deadline':
          return '#986db2'
        case 'noDeadline':
          return '#ff9900'
        case 'level':
          return '#2d8cf0'
        case 'addTag':
          return '#19be6b'
        case 'removeTag':
          return '#ff9900'
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/style/variable'

.tag-select
  position relative
  display flex
  align-items center
  padding 0 6px 6px 0
  font-size 12px
  cursor pointer
  .label
    flex 1
.tag-list
  padding 0
  .no-data
    color $color-grey
  .tag-item
    padding 0
.modal
  display flex
  flex-direction column
  height calc(100vh - 120px)
.modal-main
  flex 1
  overflow-y auto
.modal-header
  display flex
  align-items center
  height 50px
  padding 0 16px
  border-bottom 1px solid $color-divider-light
  .title
    font-size 14px
    font-weight 700
    color $color-grey
.modal-footer
  display flex
  padding 12px 16px
  border-top 1px solid $color-divider-light
  .comment
    display flex
    align-items center
    flex 1
.modal-footer.expand
  box-shadow 0 0 5px rgba(0, 0, 0, 0.2)
.modal-content
  padding 0 16px
.task
  position relative
  display flex
  &-main
    flex 1
    height 100%
  &-sider
    width 150px
    margin 0 16px
    padding-top 16px
    &-item
      margin-bottom 12px
      .item-dropdown
        width 150px
      .item-wrapper
        cursor pointer
      .item-header
        padding-bottom 6px
  &-header
    position relative
    display flex
    align-items center
    padding 16px
    .title
      flex 1
      width 0
      font-size $font-size-medium-x
      color $color-text
  &-content
    margin 0 16px
    padding-left 24px
  &-info
    display flex
    align-items center
    .info-item
      display inline-block
      color $color-grey
      &-label
        padding 2px 8px
  &-desc
    position relative
    margin 16px 0
    max-height 250px
    word-break break-all
    font-size $font-size-medium
    overflow hidden
    &:after
      content ''
      display block
      position absolute
      z-index 3
      right 0
      bottom 0
      left 0
      height 60px
      background-image linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #fff 100%)
  &-desc-expand
    position relative
    margin 16px 0
    word-break break-all
    font-size $font-size-medium
  &-desc-placeholder
    color grey
  &-desc-text
    color $color-text-light
  &-desc-show-more
    padding-bottom 16px
    font-size 14px
    color $color-primary
    cursor pointer
    &:hover
      text-decoration underline
  &-meta
    margin 0 16px
    padding 16px 0
  &-events
    padding 0
  &-event-item
    display flex
    align-items center
    padding 8px 16px
    .event-icon
      width 64px
      text-align center
    .event-text
      padding-right 8px
      color $color-grey
  &-comments
    padding 0
  &-comment-item
    display flex
    padding 16px
    .comment-icon
      width 64px
      text-align center
      cursor pointer
    .comment-box
      flex 1
      padding 8px
      border-radius 4px
      background #eee
    .comment-meta
      padding-top 0
      span
        padding-right 8px
    .comment-content
      padding-top 8px
      font-size $font-size-medium
</style>

