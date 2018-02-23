<template>
  <div>
    <span class="task-level" v-if="value === 0">
      <Icon class="level-icon-off" type="alert"></Icon>
      <Icon class="level-icon-off" type="alert"></Icon>
      <Icon class="level-icon-off" type="alert"></Icon>
      有空再看</span>
    <span class="task-level" v-if="value === 1">
      <Icon class="level-icon-on" type="alert"></Icon>
      <Icon class="level-icon-off" type="alert"></Icon>
      <Icon class="level-icon-off" type="alert"></Icon>
      优先处理</span>
    <span class="task-level" v-if="value === 2">
      <Icon class="level-icon-on" type="alert"></Icon>
      <Icon class="level-icon-on" type="alert"></Icon>
      <Icon class="level-icon-off" type="alert"></Icon>
      正常处理</span>
    <span class="task-level" v-if="value === 3">
      <Icon class="level-icon-on" type="alert"></Icon>
      <Icon class="level-icon-on" type="alert"></Icon>
      <Icon class="level-icon-on" type="alert"></Icon>
      十万火急</span>
  </div>
</template>

<script>
export default {
  name: 'TaskLevel',
  props: {
    value: 0
  }
}
</script>

<style>

</style>
