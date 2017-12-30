<template>
  <Button type="primary" @click="login">登录</Button>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    login() {
      this.$router.push({
        name: 'task'
      })
    }
  }

}
</script>

<style>

</style>
