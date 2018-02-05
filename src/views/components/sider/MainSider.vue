<template>
  <ul class="main-sider"><slot></slot></ul>
</template>

<script>
import Emitter from '@/common/mixins/emitter'
export default {
  name: 'MainSider',
  mixins: [Emitter],
  props: {
    activeName: {
      type: [String, Number]
    }
  },
  data() {
    return {
      currentActiveName: this.activeName
    }
  },
  methods: {
    updateActiveName() {
      if (this.currentActiveName === undefined) {
        this.currentActiveName = -1
      }
      this.broadcast(
        'MainSiderItem',
        'on-main-sider-update-active-name',
        this.currentActiveName
      )
    }
  },
  mounted() {
    this.updateActiveName()
    this.$on('on-main-sider-item-select', name => {
      this.currentActiveName = name
      this.$emit('on-select', name)
    })
  },
  watch: {
    activeName(val) {
      this.currentActiveName = val
    },
    currentActiveName() {
      this.updateActiveName()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './sider'
</style>
