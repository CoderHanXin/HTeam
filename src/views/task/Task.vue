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
          <input placeholder="添加新任务，按回车键（Enter）保存" />
          <div class="meta">
            <a href="javascript:;"><Icon type="ios-clock"></Icon></a>
            <a href="javascript:;"><Icon type="ios-clock"></Icon></a>
          </div>
        </div>
        <div class="task-list">task list</div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  name: 'Task'

}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
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
    line-height 40px
    font-size 28px
    a 
      margin-right 8px
.task-list
  flex auto
  padding 10px 0
  background #fdfdfd
</style>

