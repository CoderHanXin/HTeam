<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
      <div class="panel">
      </div>
    </div>
    <Content class="content">
    </Content>
  </Layout>
</template>

<script>
export default {
  name: 'StatsTeam',
  data() {
    return {
      mainTitle: '团队统计'
    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    init() {

    }
  }
}
</script>

<style>

</style>
