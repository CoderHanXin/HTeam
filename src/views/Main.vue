<template>
  <div class="layout">
    <MainSider :activeName="mainRoute" @on-select="handleChangeMenu">
      <MainSiderItem name="task">
        <Icon class="icon" size="18" type="ios-checkmark"></Icon>
        <p>任务</p>
      </MainSiderItem>
      <MainSiderItem name="project">
        <Icon size="18" type="ios-navigate"></Icon>
        <p>项目</p>
      </MainSiderItem>
      <MainSiderItem name="team">
        <Icon size="18" type="ios-clock"></Icon>
        <p>团队</p>
      </MainSiderItem>
    </MainSider>
    <Layout>
      <router-view></router-view>
    </Layout>
  </div>
</template>

<script>
import MainSider from '@/views/components/sider/MainSider'
import MainSiderItem from '@/views/components/sider/MainSiderItem'
export default {
  name: 'Main',
  components: {
    MainSider,
    MainSiderItem
  },
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
    menuItemClasses: function() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    },
    mainRoute() {
      let main = this.$route.name.split('-')
      return main && main[0]
    }
  },
  methods: {
    handleChangeMenu(name) {
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

<style lang="stylus">
.layout
  display flex 
  background #f5f7f9
  height 100vh
</style>
