<template>
  <div :class="classes" v-clickoutside="handleClose">
    <div :class="[prefixCls + '-rel']" ref="reference" @click="toggleMenu">
      <slot name="label"></slot>
    </div>
    <Dropdown :class="dropdownCls" v-show="visible" :placement="placement" ref="dropdown" :data-transfer="transfer" v-transfer-dom>
      <ul :class="[prefixCls + '-dropdown-list']">
        <slot></slot>
      </ul>
    </Dropdown>
  </div>
</template>

<script>
import clickoutside from '@/directives/clickoutside'
import TransferDom from '@/directives/transfer-dom'
import Dropdown from './Dropdown'
import Emitter from '@/common/mixins/emitter'
import { oneOf } from '@/common/utils/assist'

const prefixCls = 'ht-select'

function debounce(fn) {
  let waiting
  return function () {
    if (waiting) return
    waiting = true
    const context = this
    const args = arguments
    const later = function () {
      waiting = false
      fn.apply(context, args)
    }
    this.$nextTick(later)
  }
}

export default {
  name: 'HtSelect',
  mixins: [Emitter],
  directives: {
    clickoutside, TransferDom
  },
  components: {
    Dropdown
  },
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    labelInValue: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placement: {
      validator(value) {
        return oneOf(value, ['bottom', 'bottom-start', 'bottom-end'])
      },
      default: 'bottom'
    },
    transfer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      visible: false,
      options: [],
      optionInstances: [],
      slotChangeDuration: false, // if slot change duration and in multiple, set true and after slot change, set false
      model: this.value
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-multiple`]: this.multiple
        }
      ]
    },
    dropdownCls() {
      return {
        [prefixCls + '-dropdown-transfer']: this.transfer
      }
    }
  },
  watch: {
    value(val) {
      this.model = val
    },
    model() {
      if (this.multiple) {
        if (this.slotChangeDuration) {
          this.slotChangeDuration = false
        } else {
          this.updateMultipleSelected()
        }
      } else {
        this.updateSingleSelected()
      }
    },
    visible(val) {
      if (val) {
        this.broadcast('HtDropdown', 'on-update-popper')
      } else {
        this.broadcast('HtDropdown', 'on-destroy-popper')
      }
    }
  },
  mounted() {
    this.updateOptions()
    this.$on('append', this.debouncedAppendRemove())
    this.$on('remove', this.debouncedAppendRemove())
    this.$on('on-select-selected', (value) => {
      if (this.model === value) {
        this.hideMenu()
      } else {
        if (this.multiple) {
          const index = this.model.indexOf(value)
          if (index >= 0) {
            this.model.splice(index, 1)
          } else {
            this.model.push(value)
          }
          this.broadcast('HtDropdown', 'on-update-popper')
        } else {
          this.model = value
        }
      }
    })
  },
  methods: {
    toggleMenu() {
      this.visible = !this.visible
    },
    hideMenu() {
      this.visible = false
      this.broadcast('HtOption', 'on-select-close')
    },
    // find option component
    findChild(cb) {
      const find = function (child) {
        const name = child.$options.componentName

        if (name) {
          cb(child)
        } else if (child.$children.length) {
          child.$children.forEach((innerChild) => {
            find(innerChild, cb)
          })
        }
      }

      if (this.optionInstances.length) {
        this.optionInstances.forEach((child) => {
          find(child)
        })
      } else {
        this.$children.forEach((child) => {
          find(child)
        })
      }
    },
    updateOptions(slot = false) {
      let options = []
      let index = 1

      this.findChild((child) => {
        options.push({
          value: child.value,
          label: (child.label === undefined) ? child.$el.textContent : child.label
        })
        child.index = index++

        this.optionInstances.push(child)
        this.updateSingleSelected(true, slot)
        this.updateMultipleSelected(true, slot)
      })

      this.options = options
    },
    updateSingleSelected(init = false, slot = false) {
      const type = typeof this.model

      if (type === 'string' || type === 'number') {
        let findModel = false
        for (const item of this.options) {
          if (this.model === item.value) {
            findModel = true
            break
          }
        }

        if (slot && !findModel) {
          this.model = ''
        }
      }

      this.toggleSingleSelected(this.model, init)
    },
    updateMultipleSelected(init = false, slot = false) {
      if (this.multiple && Array.isArray(this.model)) {
        let selected = []
        for (const model of this.model) {
          for (const option of this.options) {
            if (model === option.value) {
              selected.push({
                value: option.value,
                label: option.label
              })
            }
          }
        }

        if (slot) {
          let selectedModel = []

          for (let i = 0; i < selected.length; i++) {
            selectedModel.push(selected[i].value)
          }

          // if slot change and remove a selected option, emit user
          if (this.model.length === selectedModel.length) {
            this.slotChangeDuration = true
          }

          this.model = selectedModel
        }
      }
      this.toggleMultipleSelected(this.model, init)
    },
    // to select option for single
    toggleSingleSelected(value, init = false) {
      if (!this.multiple) {
        let label = ''

        this.findChild((child) => {
          if (child.value === value) {
            child.selected = true
            label = (child.label === undefined) ? child.$el.innerHTML : child.label
          } else {
            child.selected = false
          }
        })

        this.hideMenu()

        if (!init) {
          if (this.labelInValue) {
            this.$emit('on-change', {
              value: value,
              label: label
            })
          } else {
            this.$emit('on-change', value)
          }
        }
      }
    },
    // to select option for multiple
    toggleMultipleSelected(value, init = false) {
      if (this.multiple) {
        let hybridValue = []
        for (let i = 0; i < value.length; i++) {
          hybridValue.push({
            value: value[i]
          })
        }

        this.findChild((child) => {
          const index = value.indexOf(child.value)

          if (index >= 0) {
            child.selected = true
            hybridValue[index].label = (child.label === undefined) ? child.$el.innerHTML : child.label
          } else {
            child.selected = false
          }
        })

        if (!init) {
          if (this.labelInValue) {
            this.$emit('on-change', hybridValue)
          } else {
            this.$emit('on-change', value)
          }
        }
      }
    },
    debouncedAppendRemove() {
      return debounce(function () {
        this.slotChange()
        this.updateOptions(true)
      })
    },
    // use when slot changed
    slotChange() {
      this.options = []
      this.optionInstances = []
    },
    handleClose() {
      this.hideMenu()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './select'
</style>

