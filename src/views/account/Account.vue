<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">个人中心</h5>
      </div>
      <Menu ref="teamMenu" class="menu" theme="light" width="auto" :active-name="$route.name" @on-select="handleChangeMenu">
        <menu-item name="profile">
            <Icon type="ios-barcode-outline" size="16"></Icon>
            个人设置
        </menu-item>
      </Menu>
    </Sider>
    <router-view/>
  </Layout>
</template>

<script>
export default {
  name: 'Account',
  methods: {
    handleChangeMenu(name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>

<style>

</style>
