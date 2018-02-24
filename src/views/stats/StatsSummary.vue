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
  name: 'StatsSummary',
  data() {
    return {
      mainTitle: '任务概况'
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
