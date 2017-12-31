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
        </div>
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
.sub-sider
  background $color-background-light
  .header
    height 50px
    border-bottom 1px solid #ddd
    .title
      float left
      line-height 50px
      margin 0 20px
      font-size $font-size-medium-x
    .more
      float right
      line-height 50px
      margin 0 20px
      font-size 22px
  .menu
    background $color-background-light
    &:after
      width 0
.main-body
  color $color-text
  border-left 1px solid #ddd
  .header
    height 50px
    margin 0
    padding 0 15px
    position relative
    background rgba(253, 253, 253, 0.95)
    .title
      float left
      line-height 50px
      font-size $font-size-medium-x
      span
        margin-right 4px
  .content
    margin $spacing-medium
    .task-add-quick
      display flex
      position relative
      margin-bottom 10px
      padding 5px 15px
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
</style>

