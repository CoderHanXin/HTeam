<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">
        <span>
          <Icon size="18" color="#2d8cf0" type="speedometer"></Icon>
        </span>
        我的任务
      </div>
    </div>
    <Content class="content">
      <div class="task-add-quick">
        <input class="title" v-model="task.title" @keyup.enter="createTask" :autofocus="true" placeholder="添加新任务，按回车键（Enter）保存" />
        <div class="meta">
          <DatePicker 
            @on-change="datePickerChange" 
            @on-clear="datePickerClear"
            @on-ok="datePickerOk"
            :open="isDatePickerOpen" 
            :value="task.deadline" 
            :options="dateOptions"
            :transfer="true" 
            type="datetime" 
            format="yyyy-MM-dd HH:mm" 
            placement="bottom-end">
            <a @click="datePickerClick" v-show="!isDateSelected"><Icon size="28" type="ios-clock"></Icon></a>
            <a class="deadline link-text" @click="datePickerClick" v-show="isDateSelected">{{deadlineLabel | deadline}}</a>
          </DatePicker>
          <div class="assignee">
            <a @click="selectAssignee" ><Icon size="28" type="ios-analytics"></Icon></a>
          </div>
        </div>
      </div>
      <div class="task-list">
        <ul>
          <li class="task-item">
            <Card :bordered="false" :padding="0" class="task-card">
              <div class="task-item-wrapper">
                <div class="task-item-body">
                  <Checkbox :size="'large'" class="task-check"></Checkbox>
                  <div class="task-title">
                    <span>任务001任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长任务标题特别的长</span>
                  </div>
                  <div class="task-meta">
                    <span class="task-label">
                      <Icon type="ios-filing-outline" size="14"></Icon>
                      项目名称001</span>
                    <a class="task-tag">紧急</a>
                    <span class="task-label">
                      <Icon type="ios-chatboxes-outline"></Icon>
                      4</span>
                    <span class="task-label">
                      <Icon type="ios-clock-outline"></Icon>
                      1月31日 截至</span>
                    <span class="task-assignee">老韩</span>
                  </div>
                </div>
              </div>
            </Card>
          </li>
          <li v-for="(item, index) in list" :key="index" class="task-item">
            <Card :bordered="false" :padding="0">
              <div class="task-item-wrapper">
                <div class="task-item-body">
                  <Checkbox :size="'large'" class="task-check"></Checkbox>
                  <div class="task-title">
                    <span>{{item.title}}</span>
                  </div>
                  <div class="task-meta">
                    <span v-if="item.deadline" class="task-label">
                      <Icon type="ios-clock-outline"></Icon>
                      {{item.deadline | deadline}} 截止</span>
                    <span class="task-assignee">老韩</span>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        </ul>
      </div>
    </Content>
  </Layout>
</template>

<script>
import url from '../../api/url'
export default {
  name: 'Task',
  data() {
    return {
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      isDatePickerOpen: false,
      task: {
        title: '',
        deadline: ''
      },
      deadlineLabel: '',
      list: []
    }
  },
  computed: {
    isDateSelected() {
      return this.deadlineLabel && true
    }
  },
  created() {
    this.getTaskInbox()
  },
  methods: {
    selectAssignee() {
      console.log('指定负责人')
    },
    getTaskInbox() {
      this.$http.get(url.task_inbox, { assignee: 1, type: 10 }).then(res => {
        console.log(res.data.data)
        this.list = res.data.data
      })
    },
    createTask() {
      let title = this.task.title.trim()
      if (title === '') {
        console.log('空白字符')
        return
      }
      let task = {}
      task.title = title
      if (this.task.deadline) {
        task.deadline = this.task.deadline
      }
      this.$http.post(url.task_create, task).then(res => {
        this.$Message.success('操作成功')
      })
    },
    datePickerClick() {
      this.isDatePickerOpen = !this.isDatePickerOpen
    },
    datePickerChange(date) {
      console.log('change deadline:' + date)
      this.task.deadline = date
      if (this.task.deadline === '') {
        this.deadlineLabel = this.task.deadline
      }
    },
    datePickerClear() {
      this.isDatePickerOpen = false
      console.log('clear deadline:' + this.task.deadline)
    },
    datePickerOk() {
      this.deadlineLabel = this.task.deadline
      this.isDatePickerOpen = false
      console.log('ok deadline:' + this.task.deadline)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
@import '~@/style/mixin'
.task-item
  position relative
  padding-bottom 2px
  cursor: pointer
.task-item-wrapper
  position relative
  padding 0 20px
.task-item-body 
  position relative
  display flex
  align-items center
  padding 16px 0
  &:after
    setBottomLine(#eeeeee)
.task-title 
  flex 1
  padding-right 16px
  color $color-text
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
.task-meta 
  flex-shrink 0
  font-size 12px
  color $color-grey
  .task-tag   
    margin-right 6px
    padding 2px 6px
    border-radius 3px
    color #ffffff
    background-color $color-error
  .task-label 
    margin-right 6px
  .task-assignee 
    margin-right 6px
.task-add-quick
  display flex
  position relative
  margin-bottom 10px
  padding 5px 16px
  border-radius 2px
  background #fdfdfd
  .title
    flex 1
    display block
    width 100%
    height 40px
    padding-right 16px
    line-height 40px
    font-size 14px
    color $color-text-light
    border none
    outline none
    overflow hidden
  .meta
    flex-shrink 0
    display flex
    align-items center
    .deadline
      text-align right 
      font-size 14px
    a 
      display inline-block
      margin-right 8px
.task-list
  flex auto
  padding 10px 0
  background #fdfdfd
</style>
