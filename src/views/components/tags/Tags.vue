<template>
  <div>
    <Modal v-model="visable" @on-cancel="handleCancel" :title="modalTitle" :footer-hide="true" width="480">
      <div class="header" slot="header">
        <div v-show="isAction" @click="back" class="back">
          <Icon size="12" color="#2d8cf0" type="chevron-left"></Icon>
        </div>
        <span>{{modalTitle}}</span>
      </div>
      <div v-if="!isAction">
        <ul class="list">
          <li v-for="item in tags" :key="item.id" class="item">
            <div class="item-cell">
              <Tag :color="item.color">{{item.name}}</Tag>
            </div>
            <div class="item-more">
              <span @click.stop="handleEditShow(item)" title="修改" class="item-more-icon action-edit">
                <Icon size="16" type="ios-gear-outline"></Icon>
              </span>
              <span @click.stop="handleDelete(item)" title="删除" class="item-more-icon action-delete">
                <Icon size="16" type="ios-trash-outline"></Icon>
              </span>
            </div>
          </li>
        </ul>
        <div class="action">
          <div @click.stop="handleCreateShow" class="icon">
            <Icon size="32" color="#19be6b" type="android-add"></Icon>
          </div>
        </div>
      </div>
      <div v-if="isAction">
        <p class="info margin-bottom-16">{{info}}</p>
        <div class="input-group-wrapper margin-bottom-16">
          <div class="input-group">
            <input v-model="tag.name" class="input-inside" type="text" placeholder="请输入">
            <span class="color-block" :style="{background: tag.color}"></span>
            <Button v-if="isCreate" @click="handleCreate" class="margin-left-4" type="success">创建</Button>
            <Button v-else @click="handleEdit" class="margin-left-4" type="primary">修改</Button>
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
import tagService from '@/api/services/tag'
import colors from '@/common/constant/color'
import { mapGetters, mapMutations } from 'vuex'

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
      info: '标签的使用范围是团队所有项目，请谨慎添加、修改和删除。',
      colorList: colors,
      isAction: false,
      isCreate: true,
      tag: {
        name: '',
        color: colors[0]
      }
    }
  },
  computed: {
    ...mapGetters([
      'tags',
      'currentTeam'
    ])
  },
  watch: {
    value(val) {
      this.visable = val
    }
  },
  methods: {
    getTagList() {
      tagService.getList(this.currentTeam.id).then(res => {
        this.setTags(res.data.data)
      })
    },
    handleCreateShow() {
      this.modalTitle = '创建标签'
      this.isAction = true
      this.isCreate = true
    },
    handleEditShow(item) {
      this.modalTitle = '修改标签'
      this.tag = Object.assign({}, item)
      this.isAction = true
      this.isCreate = false
    },
    handleCreate() {
      let tag = {}
      tag.name = this.tag.name
      tag.color = this.tag.color
      tag.team_id = this.currentTeam.id
      tagService.add(tag).then(res => {
        console.log(res.data)
        this.back()
        this.getTagList()
      })
    },
    handleEdit() {
      let tag = {}
      tag.name = this.tag.name
      tag.color = this.tag.color
      tagService.update(this.tag.id, tag).then(res => {
        console.log(res.data)
        this.back()
        this.getTagList()
      })
    },
    handleDelete(item) {
      let info = this.info
      this.$Modal.confirm({
        title: `确定删除标签吗`,
        content: info,
        loading: true,
        onOk: () => {
          tagService.delete(item.id).then(res => {
            this.getTagList()
            this.$Modal.remove()
          })
        }
      })
    },
    handleCancel() {
      this.back()
      this.$emit('onTagsCancel')
    },
    back() {
      this.modalTitle = '标签管理'
      this.resetFields()
      this.isAction = false
    },
    resetFields() {
      let tag = { name: '', color: this.colorList[0] }
      this.tag = tag
    },
    changeColor(color) {
      this.tag.color = color
    },
    ...mapMutations([
      'setTags'
    ])
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/style/variable'
@import '~@/style/mixin'

.header
  display flex
  align-items center
  font-size 14px
  font-weight 700
  .back
    padding 0 4px
    cursor pointer
.action
  text-align right
  .icon
    padding 0 4px
    cursor pointer
.list
  height 320px
  overflow-x hidden
.item
  position relative
  display flex
  align-items center
  padding 8px 16px
  &:after
    setBottomLine()
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
    .action-edit
      &:hover
        color $color-primary
    .action-delete
      &:hover
        color $color-error
.input-group-wrapper
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

