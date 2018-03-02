<template>
  <div v-show="visable">
    <Modal class="tags" v-model="visable" @on-cancel="handleCancel" :title="modalTitle" :footer-hide="true" width="480">
      <div class="header" slot="header">
        <div v-show="isAction" @click="back" class="back">
          <Icon size="12" color="#2d8cf0" type="chevron-left"></Icon>
        </div>
        <span>{{modalTitle}}</span>
      </div>
      <div v-if="!isAction" class="list-wrapper">
        <ul class="list">
          <li v-for="item in tagList" :key="item.id" class="item">
            <div class="item-cell">
              <span class="tag" :style="{background: item.color}">{{item.name}}</span>
            </div>
            <div class="item-more">
              <span @click.stop="handleEditShow(item)" class="item-more-icon">
                <Icon size="16" type="ios-gear-outline"></Icon>
              </span>
              <span @click.stop="handleDelete(item)" class="item-more-icon">
                <Icon size="16" type="ios-trash-outline"></Icon>
              </span>
            </div>
          </li>
        </ul>
        <div class="action">
          <div @click.stop="handleAddShow" class="icon">
            <Icon size="32" color="#19be6b" type="android-add"></Icon>
          </div>
        </div>
      </div>
      <div v-if="isAction">
        <p class="info margin-bottom-16">标签对所有项目、团队成员均可见，请谨慎添加、编辑和删除标签。</p>
        <div class="tag-group margin-bottom-16">
          <div class="input-group">
            <input v-model="tag.name" class="input-inside" type="text" placeholder="请输入">
            <span class="color-block" :style="{background: tag.color}"></span>
            <Button v-if="isAdd" class="margin-left-4" type="success">创建</Button>
            <Button v-else class="margin-left-4" type="primary">修改</Button>
          </div>
        </div>
        <div class="color-box margin-bottom-16">
          <span v-for="(item, index ) in colorList" :key="index" @click="changeColor(item)" :class="{'color-item-selected': item === tag.color}" class="color-item" :style="{background: item}"></span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import colors from '@/common/constant/color'
export default {
  name: 'Tags',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visable: this.value,
      modalTitle: '标签管理',
      isBackVisable: false,
      colorList: colors,
      isAction: false,
      isAdd: true,
      show: 'list',
      tag: {
        name: '',
        color: '#990000'
      },
      tagList: [
        {
          id: 1,
          name: 'bug',
          color: '#990000'
        },
        {
          id: 2,
          name: 'feature',
          color: '#009900'
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.visable = val
    }
  },
  methods: {
    handleCancel() {
      this.$emit('onTagsCancel')
    },
    back() {
      this.modalTitle = '标签管理'
      this.isAction = false
    },
    handleAddShow() {
      this.modalTitle = '创建标签'
      this.isAction = true
    },
    handleEditShow(item) {
      this.modalTitle = '修改标签'
      this.tag = item
      this.isAction = true
    },
    handleDelete(item) {

    },
    changeColor(color) {
      this.tag.color = color
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
@import '~@/style/mixin'

.tags .ivu-modal-footer
  display none !important
.header
  display flex
  align-items center
  font-size 14px
  font-weight 700
  .back
    padding 0 4px
    cursor pointer
.list-wrapper
  padding 0
  .action
    text-align right
    .icon
      padding 0 4px
      cursor pointer
.list
  height 320px
.item
  position relative
  display flex
  align-items center
  padding 8px 16px
  &:after
    setBottomLine(#eee)
  &:hover
    background #f3f3f3
  &-cell
    flex 1
  &-more
    width 50px
    text-align right
    &-icon
      padding 4px
      cursor pointer
      color $color-grey
      &:hover
        color $color-primary
.tag
  color #fff
  border-radius 3px
  padding 3px 8px
.tag-group
  display flex
  align-items center
.input-group
  position relative
  display flex
  width 100%
  .input-inside
    position relative
    flex 1
    width 100%
    height 36px
    padding 6px 16px 6px 40px
    color $color-text-light
    font-size 14px
    cursor text
    placeholder()
    border 1px solid #eee
    border-radius 4px
    transition border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out
    &:focus
      border-color #57a3f3
      outline 0
      box-shadow 0 0 0 2px rgba(45, 140, 240, 0.2)
    &:hover
      border-color #57a3f3
  .color-block
    position absolute
    display inline-block
    top 6px
    left 10px
    height 24px
    width 24px
    border-radius 3px
    cursor pointer
    z-index 1
.info
  font-size 14px
  color $color-grey
</style>

