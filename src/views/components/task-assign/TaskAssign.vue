<template>
  <div :class="[prefixCls]">
    <a :class="[prefixCls + '-label']">
      <span>{{assigneeLabel}}</span>
      <span>·</span>
      <span>{{deadlineLabel}}</span>
    </a>
    <div :class="[prefixCls+ '-popper']">
      <div :class="[prefixCls+ '-content']">
        <div :class="[prefixCls+ '-arrow']"></div>
        <div :class="[prefixCls+ '-inner']">
          <div>
            <h3>将任务指派给</h3>
            <Select v-model="assignee" clearable placeholder="选择成员">
              <Option v-for="item in members" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div>
            <h3>任务截止时间</h3>
            <DatePicker type="date" placeholder="选择截止时间" :value="deadline" :options="dateOptions" :transfer="true" format="yyyy-MM-dd" placement="bottom-end"></DatePicker>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const prefixCls = 'task-assign'
export default {
  name: 'TaskAssign',
  props: {
    value: {
      type: Array,
      default: () => [null, null],
      required: true
    },
    members: {
      type: Array,
      default: () => []
    }
  },
  date() {
    return {
      prefixCls: prefixCls,
      visible: false,
      assignee: this.value[0],
      deadline: this.value[1],
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  computed: {
    assigneeLabel() {
      if (this.assignee === null) {
        return '未指派'
      }
      return this.assignee.name
    },
    deadlineLabel() {
      if (this.deadline === null) {
        return '没有截止时间'
      }
      return this.deadline
    }
  }
}
</script>

<style lang="stylus" scoped>
.task-assign
  &-label
    
</style>

