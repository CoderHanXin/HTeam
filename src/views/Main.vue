<template>
  <Layout class="layout">
    <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
      <Menu theme="dark" width="auto" :class="menuitemClasses" @on-select="changeMenu">
        <Tooltip placement="right" content="消息" :disabled="tooltip">
          <menu-item name="1">
            <Icon type="ios-chatboxes"></Icon>
            <span>消息</span>
          </menu-item>
        </Tooltip>
        <Tooltip placement="right" content="任务" :disabled="tooltip">
          <menu-item name="task">
            <Icon type="ios-checkmark"></Icon>
            <span>任务</span>
          </menu-item>
        </Tooltip>
        <Tooltip placement="right" content="项目" :disabled="tooltip">
          <menu-item name="project">
            <Icon type="ios-navigate"></Icon>
            <span>项目</span>
          </menu-item>
        </Tooltip>
        <Tooltip placement="right" content="日历" :disabled="tooltip">
          <menu-item name="4">
            <Icon type="ios-clock"></Icon>
            <span>日历</span>
          </menu-item>
        </Tooltip>
      </Menu>
    </Sider>
    <Layout>
        <router-view></router-view>
    </Layout>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false
    }
  },
  props: {
    beforePush: {
      type: Function
    }
  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    tooltip: function () {
      return !this.isCollapsed
    }
  },
  methods: {
    changeMenu(name) {
      let willpush = true
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false
        }
      }
      if (willpush) {
        this.$router.push({
          name: name
        })
      }
    }
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 126px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
