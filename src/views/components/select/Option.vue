<template>
  <li :class="classes" @click.stop="select" @mouseout.stop="blur">
    <slot>{{ showLabel }}</slot>
    <Icon :class="iconClasses" :style="iconStyles" size="20" type="ios-checkmark-empty"></Icon>
  </li>
</template>

<script>
import Emitter from '@/common/mixins/emitter'

const prefixCls = 'ht-select-item'

export default {
  name: 'HtOption',
  componentName: 'ht-select-item',
  mixins: [Emitter],
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: false,
      index: 0, // for up and down to focus
      isFocus: false
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-focus`]: this.isFocus
        }
      ]
    },
    iconClasses() {
      return `${prefixCls}-selected-icon`
    },
    iconStyles() {
      if (!this.selected) {
        return { display: 'none' }
      }
    },
    showLabel() {
      return this.label ? this.label : this.value
    }
  },
  mounted() {
    this.dispatch('HtSelect', 'append')
    this.$on('on-select-close', () => {
      this.isFocus = false
    })
  },
  beforeDestroy() {
    this.dispatch('HtSelect', 'remove')
  },
  methods: {
    select() {
      if (this.disabled) {
        return false
      }

      this.dispatch('HtSelect', 'on-select-selected', this.value)
    },
    blur() {
      this.isFocus = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './select'
</style>
