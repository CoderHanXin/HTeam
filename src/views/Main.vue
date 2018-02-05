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
    <div class="avatar">
      <Avatar size="large">{{avatarName}}</Avatar>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
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
      currentUser: {},
      isCollapsed: false
    }
  },
  props: {
    beforePush: {
      type: Function
    }
  },
  computed: {
    mainRoute() {
      let main = this.$route.name.split('-')
      return main && main[0]
    },
    avatarName() {
      return this.currentUser.name.substr(-2)
    }
  },
  created() {
    this.currentUser = Cookies.getJSON('currentUser')
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
  position relative
  display flex 
  background #f5f7f9
  height 100vh
.avatar
  position absolute
  bottom 16px
  left 15px
  cursor pointer
  &:hover
    color #000
    opacity 0.6    
</style>
