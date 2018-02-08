<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">项目</h5>
        <div class="more">
          <Button type="ghost" shape="circle" size="small" icon="android-add"></Button>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :activeName="activeMenuName" @on-select="handleChangeMenu">
        <menu-item name="all">
          <Icon type="ios-folder" size="16"></Icon>
          所有项目
        </menu-item>
        <menu-item name="created">
          <Icon type="ios-list" size="16"></Icon>
          我创建的
        </menu-item>
        <menu-item name="joined">
          <Icon type="ios-pricetag" size="16"></Icon>
          我参与的
        </menu-item>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div class="header">
        <div class="title">{{mainTitle}}</div>
      </div>
      <Content class="content">
        <div class="project-list">
          <ul>
            <li class="project-item">
              <Card :bordered="false" :padding="0">
                <div class="project-item-wrapper">
                  <div class="project-item-body">
                    <div class="project-item-title">项目11</div>
                    <div class="project-item-meta">
                      <span class="project-item-meta-text">待处理任务</span>
                      <span class="task-count">10</span>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
            <li class="project-item">
              <Card :bordered="false" :padding="0">
                <div class="project-item-wrapper">
                  <div class="project-item-body">
                    <div class="project-item-title">项目11</div>
                    <div class="project-item-meta">
                      <span class="project-item-meta-text">待处理任务</span>
                      <span class="task-count">10</span>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
            <li class="project-item">
              <Card :bordered="false" :padding="0">
                <div class="project-item-wrapper">
                  <div class="project-item-body">
                    <div class="project-item-title">项目11</div>
                    <div class="project-item-meta">
                      <span class="project-item-meta-text">待处理任务</span>
                      <span class="task-count">10</span>
                    </div>
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
import Cookies from 'js-cookie'
// import url from '../../api/url'
export default {
  name: 'Project',
  data() {
    return {
      currentTeam: {},
      currentUser: {},
      activeMenuName: 'all',
      list: []
    }
  },
  computed: {
    mainTitle() {
      switch (this.activeMenuName) {
        case 'all':
          return '所有任务'
        case 'created':
          return '我创建的'
        case 'joined':
          return '我参与的'
      }
    }
  },
  created() {
    this.currentTeam = Cookies.getJSON('currentTeam')
    this.init()
  },
  methods: {
    handleChangeMenu(name) {
      this.activeMenuName = name
    },
    init() {

    }
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/style/mixin'
@import '~@/style/variable'

.project-list
  flex auto
  padding 10px 0
  background #fdfdfd
.project-item
  padding-bottom 2px
  font-size 14px
  cursor pointer
.project-item-wrapper
  padding 0 20px
.project-item-body
  position relative
  display flex
  padding 16px 0
  &:after
    setBottomLine(#eee)
.project-item-title
  flex 1
  width 0
  padding-right 16px
  font-size 14px
  color $color-text
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
.project-item-meta
  flex-shrink 0
.project-item-meta-text
  color $color-grey
  font-size 12px
.project-item-meta-count
  color $color-text
  font-size 14px
</style>
