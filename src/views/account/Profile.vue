<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">个人设置</div>
    </div>
    <Content class="content">
      <Card>
        <div style="width: 460px">
          <div class="avatar-item">
            <div class="avatar-label">
              <Avatar :style="{background: editUser.color || '#2d8cf0'}" size="large">{{editUser.name.substr(-2)}}</Avatar>
            </div>
            <div class="color-box">
              <span v-for="(item, index ) in colorList" :key="index" @click="changeColor(item)" :class="{'color-item-selected': item === editUser.color}" class="color-item" :style="{background: item}"></span>
            </div>
            <div class="color-picker">
              自选
              <ColorPicker @on-change="pickColor" v-model="selfPickColor" size="small" />
            </div>
          </div>
          <Form ref="userForm" :model="editUser" :rules="rules" :label-width="80">
            <FormItem label="用户名" prop="username">
              <Input type="text" v-model="editUser.username" :maxlength="20" disabled/>
            </FormItem>
            <FormItem label="姓名" prop="name">
              <Input type="text" v-model.trim="editUser.name" :maxlength="20" />
            </FormItem>
            <FormItem label="手机号" prop="phone">
              <Input type="text" v-model.trim="editUser.phone" :maxlength="11" />
            </FormItem>
            <FormItem label="备注" prop="desc">
              <Input type="textarea" v-model.trim="editUser.desc" :rows="3" class="textarea-desc" />
            </FormItem>
            <FormItem>
              <Button type="primary" style="width: 100px;" :loading="saveLoading" @click="handleSaveClick">保存</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import Cookies from 'js-cookie'
import userService from '@/api/services/user'
import colors from '@/common/constant/color'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Profile',
  data() {
    return {
      saveLoading: false,
      editUser: {},
      selfPickColor: '#2d8cf0',
      colorList: colors,
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [
          {
            type: 'string',
            pattern: /^\d+$/gi,
            message: '手机号只能是数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  created() {
    this.editUser = Object.assign({}, this.currentUser)
  },
  methods: {
    handleSaveClick() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          let user = {}
          user.id = this.editUser.id
          user.name = this.editUser.name
          user.phone = this.editUser.phone
          user.desc = this.editUser.desc
          user.color = this.editUser.color
          userService.update(user.id, user)
            .then(res => {
              Cookies.set('currentUser', this.editUser)
              this.setCurrentUser(Object.assign({}, this.editUser))
              this.$Message.success('操作成功')
            })
        }
      })
    },
    changeColor(color) {
      this.editUser.color = color
    },
    pickColor(color) {
      this.editUser.color = color
    },
    ...mapMutations([
      'setCurrentUser'
    ])
  }
}
</script>

<style lang="stylus" scoped>
.avatar-item
  display flex
  align-items center
  margin 24px 0
.avatar-label
  width 80px
  padding-right 12px
  text-align right
.color-box
  position relative
  height 24px
  line-height 0
.color-item
  position relative
  display inline-block
  width 24px
  height 24px
  margin 0 4px 4px 0
  cursor pointer
  &:hover
    outline #fff solid 2px
    box-shadow 0 0 5px 2px rgba(0, 0, 0, 0.25)
    z-index 1
.color-item-selected
  outline #fff solid 2px
  box-shadow 0 0 5px 2px rgba(0, 0, 0, 0.25)
  z-index 1
.color-picker
  padding-left 8px
</style>
