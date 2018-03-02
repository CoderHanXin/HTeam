<template>
  <ul class="sider-menu" :style="{fontSize: size + 'px'}">
    <slot></slot>
  </ul>
</template>

<script>
import Emitter from '@/common/mixins/emitter'
export default {
  name: 'SiderMenu',
  mixins: [Emitter],
  props: {
    activeName: {
      type: [String, Number]
    },
    size: {
      type: [Number],
      default: 14
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
        'SiderMenuItem',
        'on-sider-menu-update-active-name',
        this.currentActiveName
      )
    }
  },
  mounted() {
    this.updateActiveName()
    this.$on('on-sider-menu-item-select', name => {
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
@import './sider-menu'
</style>
