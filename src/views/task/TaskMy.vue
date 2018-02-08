<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">我的任务</div>
      <div class="panel">
        <Select class="task-filter" v-model="taskFilterValue" @on-change="handleFilterChange">
          <Option v-for="item in taskFilters" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
    <Content class="content">
      <div class="task-quick-add">
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
        <ul v-if="!isTaskGroup">
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
          <li v-for="(item, index) in taskList" :key="index" class="task-item">
            <Card :bordered="false" :padding="0">
              <div class="task-item-wrapper">
                <div class="task-item-body">
                  <Checkbox @on-change="handleTaskCheck(item)" v-model="item.complete" :true-value="1" :false-value="0" :size="'large'" class="task-check"></Checkbox>
                  <div class="task-title">
                    <span :class="{'task-complete': item.complete}">{{item.title}}</span>
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
        <Collapse v-model="taskGroupsKeys" v-if="isTaskGroup" class="task-groups">
          <Panel v-for="(group, index) in taskGroups" :key="index" :name="group.key" class="task-group-item">
            {{group.name}}
            <ul slot="content">
              <li v-for="(item, index) in group.children" :key="index" class="task-item">
                <Card :bordered="false" :padding="0">
                  <div class="task-item-wrapper">
                    <div class="task-item-body">
                      <Checkbox @on-change="handleTaskCheck(item)" v-model="item.complete" :true-value="1" :false-value="0" :size="'large'" class="task-check"></Checkbox>
                      <div class="task-title">
                        <span :class="{'task-complete': item.complete}">{{item.title}}</span>
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
          </Panel>
        </Collapse>
      </div>
    </Content>
  </Layout>
</template>

<script>
// import { mapActions, mapMutations, mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import url from '../../api/url'
import util from '../../libs/util'
import { taskMyFilters } from '../../common/constant/task_filter'
const ALL_KEYS = [
  'today',
  'expired',
  'tomorrow',
  'thisWeek',
  'thisMonth',
  'other'
]
export default {
  name: 'Task',
  data() {
    return {
      currentUser: {},
      taskFilterValue: 100,
      taskFilters: taskMyFilters,
      task: {
        title: '',
        deadline: ''
      },
      taskData: [],
      filterType: 10,
      taskGroupsKeys: [],
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
    isTaskGroup() {
      if (
        this.taskFilterValue === 11 ||
        this.taskFilterValue === 12 ||
        this.taskFilterValue === 13
      ) {
        return true
      } else {
        return false
      }
    },
    taskList() {
      if (this.taskFilterValue === 100) {
        return this.taskData.sort(util.taskSortIdDesc)
      } else if (this.taskFilterValue === 14) {
        return this.taskData.sort(util.taskSortUpdateTimeDesc)
      } else if (this.taskFilterValue === 15) {
        return this.taskData.sort(util.taskSortCompleteTimeDesc)
      } else {
        return []
      }
    },
    taskGroups() {
      let groups = []
      if (this.taskFilterValue === 13) {
        let today = []
        let expired = []
        let tomorrow = []
        let thisWeek = []
        let thisMonth = []
        let other = []
        for (const item of this.taskData) {
          if (!item.deadline) {
            other.push(item)
          } else {
            if (util.timeEqualToday(item.deadline)) {
              today.push(item)
            } else if (util.timeEqualTomorrow(item.deadline)) {
              tomorrow.push(item)
            } else if (util.timeLessThanToday(item.deadline)) {
              expired.push(item)
            } else if (util.timeLessThanNextWeek(item.deadline)) {
              thisWeek.push(item)
            } else if (util.timeLessThanNextMonth(item.deadline)) {
              thisMonth.push(item)
            } else {
              other.push(item)
            }
          }
        }
        if (today.length > 0) {
          today.sort(util.taskSortDeadlineDesc)
          groups.push({ key: 'today', name: '今天', children: today })
        }
        if (expired.length > 0) {
          expired.sort(util.taskSortDeadlineDesc)
          groups.push({ key: 'expired', name: '已延期', children: expired })
        }
        if (tomorrow.length > 0) {
          tomorrow.sort(util.taskSortDeadlineAsc)
          groups.push({ key: 'tomorrow', name: '明天', children: tomorrow })
        }
        if (thisWeek.length > 0) {
          thisWeek.sort(util.taskSortDeadlineAsc)
          groups.push({ key: 'thisWeek', name: '本周', children: thisWeek })
        }
        if (thisMonth.length > 0) {
          thisMonth.sort(util.taskSortDeadlineAsc)
          groups.push({ key: 'thisMonth', name: '本月', children: thisMonth })
        }
        if (other.length > 0) {
          other.sort(util.taskSortDeadlineDesc)
          groups.push({ key: 'other', name: '其他', children: other })
        }
      } else if (this.taskFilterValue === 11) {
        // 按优先级
      } else if (this.taskFilterValue === 12) {
        // 按项目
      } else {
      }
      return groups
    }
  },
  created() {
    this.currentUser = Cookies.getJSON('currentUser')
    this.getTaskInbox()
  },
  methods: {
    handleFilterChange(val) {
      let previous = this.filterType
      if (val === 100) {
        this.filterType = 10
      } else if (val === 15) {
        this.filterType = 1
      } else {
        this.filterType = 0
      }
      if (previous !== this.filterType) {
        this.getTaskInbox()
      }
    },
    handleTaskCheck(item) {
      let task = {}
      task.id = item.id
      task.complete = item.complete
      this.$http.put(url.task_update, task).then(res => {
        console.log(res.data)
      })
    },
    selectAssignee() {
      console.log('指定负责人')
    },
    getTaskInbox() {
      this.taskGroupsKeys = []
      this.$http
        .get(url.task_inbox, {
          assignee: this.currentUser.id,
          type: this.filterType
        })
        .then(res => {
          console.log(res.data.data)
          this.taskData = res.data.data
          this.$nextTick(() => {
            this.taskGroupsKeys = ALL_KEYS
          })
        })
    },
    createTask() {
      let title = this.task.title.trim()
      if (title === '') {
        return
      }
      let task = {}
      task.assigneeId = this.currentUser.id
      task.title = title
      if (this.task.deadline) {
        task.deadline = this.task.deadline
      }
      this.$http.post(url.task_create, task).then(res => {
        this.getTaskInbox()
        this.$Message.success('操作成功')
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
    }
  }
}
</script>

<style lang="stylus">
.task-groups
  padding 0
.task-group-item .ivu-collapse-header
  padding-left 16px !important
.task-group-item .ivu-collapse-content 
  padding 0
.task-group-item .ivu-collapse-content-box
  padding 0
</style>
