<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">任务</h5>
        <div class="more">
          <Button type="ghost" shape="circle" size="small" icon="plus-round"></Button>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :active-name="$route.name" :open-names="['1','2']" @on-select="handleChangeMenu">
        <Submenu name="1">
          <template slot="title">
            工作台
          </template>
          <menu-item name="task-my">
            <Icon type="speedometer" size="16"></Icon>我的任务</menu-item>
          <menu-item name="task-joined">
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
    <router-view/>
  </Layout>
</template>

<script>
export default {
  name: 'Task',
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    handleChangeMenu(name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
