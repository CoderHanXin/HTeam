<template>
    <li :class="classes" @click.stop="handleClick"><slot></slot></li>
</template>

<script>
import Emitter from '@/common/mixins/emitter'
const prefixCls = 'sider-menu-item'
export default {
  name: 'SiderMenuItem',
  mixins: [Emitter],
  props: {
    name: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    classes() {
      return [
        prefixCls,
        {
          [`${prefixCls}-active`]: this.active,
          [`${prefixCls}-selected`]: this.active
        }
      ]
    }
  },
  methods: {
    handleClick() {
      this.dispatch('SiderMenu', 'on-sider-menu-item-select', this.name)
    }
  },
  mounted() {
    this.$on('on-sider-menu-update-active-name', name => {
      if (this.name === name) {
        this.active = true
      } else {
        this.active = false
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
@import './sider-menu'
</style>
