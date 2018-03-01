<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">统计分析</h5>
      </div>
      <Menu class="menu" theme="light" width="auto" :activeName="$route.name" @on-select="handleChangeMenu">
        <menu-item name="stats-summary">
          <Icon type="stats-bars" size="16"></Icon>
          任务概况
        </menu-item>
        <menu-item name="stats-weekly">
          <Icon type="stats-bars" size="16"></Icon>
          任务周报
        </menu-item>
        <menu-item name="stats-team">
          <Icon type="stats-bars" size="16"></Icon>
          团队统计
        </menu-item>
      </Menu>
    </Sider>
    <router-view/>
  </Layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Stats',
  components: {
  },
  data() {
    return {
      activeMenuName: 'stats-summary',
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
      'currentTeam'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    },
    handleChangeMenu(name) {
      this.activeMenuName = name
      this.$router.push({
        name: name
      })
    },
    ...mapMutations([
      'setAllUsers'
    ])
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/style/mixin'
@import '~@/style/variable'
</style>
