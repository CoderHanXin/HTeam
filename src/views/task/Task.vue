<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">任务</h5>
        <div class="more">
          <Button type="ghost" shape="circle" size="small" icon="plus-round"></Button>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :open-names="['1','2']">
        <Submenu name="1">
          <template slot="title">
            工作台
          </template>
          <menu-item name="1-1">
            <Icon type="speedometer" size="16"></Icon>我的任务</menu-item>
          <menu-item name="1-2">
            <Icon type="person-stalker" size="16"></Icon>我参与的任务</menu-item>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            项目
          </template>
          <menu-item name="2-1">项目1</menu-item>
          <menu-item name="2-2">测试项目2</menu-item>
        </Submenu>
      </Menu>
    </Sider>
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
          <input v-model="task.title" @keyup.enter="createTask" placeholder="添加新任务，按回车键（Enter）保存" />
          <div class="meta">
            <DatePicker 
              @on-change="datePickerChange" 
              @on-clear="datePickerClear"
              @on-ok="datePickerOk"
              :open="isDatePickerOpen" 
              :value="task.dueDate" 
              :transfer="true" 
              type="datetime" 
              format="yyyy-MM-dd HH:mm" 
              placement="bottom-end">
              <a @click="datePickerClick"><Icon type="ios-clock"></Icon></a>
            </DatePicker>
            <a href="javascript:;"><Icon type="ios-analytics"></Icon></a>
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
                        1月31日截至</span>
                      <span class="task-assignee">老韩</span>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
            <li class="task-item">
              <Card :bordered="false" :padding="0" class="task-card">
                <div class="task-item-wrapper">
                  <div class="task-item-body">
                    <Checkbox :size="'large'" class="task-check"></Checkbox>
                    <div class="task-title">任务002</div>
                  </div>
                </div>
              </Card>
            </li>
            <li class="task-item">
              <Card :bordered="false" :padding="0" class="task-card">
                <div class="task-item-wrapper">
                  <div class="task-item-body">
                    <Checkbox :size="'large'" class="task-check"></Checkbox>
                    <div class="task-title">任务003</div>
                  </div>
                </div>
              </Card>
            </li>
          </ul>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'Task',
  data() {
    return {
      newTask: '',
      isDatePickerOpen: false,
      task: {
        title: '',
        dueDate: ''
      }
    }
  },
  created() {},
  methods: {
    createTask() {
      console.log(this.newTask)
    },
    datePickerClick() {
      this.isDatePickerOpen = !this.isDatePickerOpen
    },
    datePickerChange(date) {
      console.log(date)
      this.task.dueDate = date
    },
    datePickerClear() {
      this.isDatePickerOpen = false
    },
    datePickerOk() {
      this.isDatePickerOpen = false
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
  overflow hidden
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
  input
    display block
    max-height 120px
    height 40px
    width 100%
    line-height 40px
    font-size 14px
    color $color-text-light
    border none
    outline none
    overflow hidden
  .meta
    display flex
    align-items center
    line-height 40px
    font-size 28px
    a 
      margin-right 8px
.task-list
  flex auto
  padding 10px 0
  background #fdfdfd
</style>
