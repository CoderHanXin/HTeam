<template>
  <div class="ht-select-dropdown" :class="className" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
import { getStyle } from '@/common/utils/assist'
const Popper = require('popper.js') // eslint-disable-line
export default {
  name: 'HtDropdown',
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      popper: null,
      width: ''
    }
  },
  computed: {
    styles() {
      let style = {}
      if (this.width) {
        style.width = `${this.width}px`
      }
      return style
    }
  },
  methods: {
    update() {
      if (this.popper) {
        this.$nextTick(() => {
          this.popper.update()
        })
      } else {
        this.$nextTick(() => {
          this.popper = new Popper(this.$parent.$refs.reference, this.$el, {
            gpuAcceleration: false,
            placement: this.placement,
            boundariesPadding: 0,
            forceAbsolute: true,
            boundariesElement: 'body'
          })
          this.popper.onCreate(popper => {
            this.resetTransformOrigin(popper)
          })
        })
      }
      if (this.$parent.$options.name === 'HtSelect') {
        this.width = parseInt(getStyle(this.$parent.$el, 'width'))
      }
    },
    destroy() {
      if (this.popper) {
        this.resetTransformOrigin(this.popper)
        setTimeout(() => {
          this.popper.destroy()
          this.popper = null
        }, 300)
      }
    },
    resetTransformOrigin(popper) {
      let placementMap = { top: 'bottom', bottom: 'top' }
      let placement = popper._popper.getAttribute('x-placement').split('-')[0]
      let origin = placementMap[placement]
      popper._popper.style.transformOrigin = `center ${origin}`
    }
  },
  created() {
    this.$on('on-update-popper', this.update)
    this.$on('on-destroy-popper', this.destroy)
  },
  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './select'
</style>
