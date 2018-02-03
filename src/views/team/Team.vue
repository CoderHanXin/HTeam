<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">团队</h5>
        <div class="more">
          <Button type="ghost" shape="circle" size="small" icon="android-add"></Button>
        </div>
      </div>
      <Menu class="menu" theme="light" width="auto" :active-name="$route.name" @on-select="handleChangeMenu">
        <menu-item name="team">
            <Icon type="ios-barcode-outline" size="16"></Icon>
            环天
        </menu-item>
        <MenuGroup title="分组">
          <menu-item name="group-1"><Icon type="ios-people" size="16"></Icon>一组</menu-item>
          <menu-item name="group-2"><Icon type="ios-people" size="16"></Icon>二组</menu-item>
        </MenuGroup>
      </Menu>
    </Sider>
    <Layout class="main-body">
      <div class="header">
        <div class="title">
          <CzsIcon type="control-rank" size="16" class="margin-right-4"></CzsIcon>全部成员
        </div>
      </div>
      <Content class="content">
        <div>
          <div class="filter-container">
            <Form inline>
              <Input v-model="search.name" placeholder="姓名" style="width:100px" class="margin-right-4"/>
              <Button @click="handleSearch" type="primary" icon="ios-search" class="margin-right-4">搜索</Button>
              <Button @click="handleAdd" type="success" icon="android-add" class="margin-right-4">添加成员</Button>
              <Button @click="handleGroupAddShow" type="success" icon="android-add" class="margin-right-4">新建分组</Button>
            </Form>
          </div>
          <Table border :columns="columns" :data="list" :loading="isLoading" ref="table" class="team-table"></Table>
          <Modal v-model="modal" @on-visible-change="onModalVisibleChange" :title="modalTitle" width="480" :mask-closable="false">
            <Form ref="userForm" :model="user" :rules="rules" :label-width="80">
              <FormItem label="姓名" prop="name">
                <Input type="text" v-model="user.name" :maxlength="20" placeholder="请输入对方真实姓名"/>
              </FormItem>
              <FormItem label="用户名" prop="username" v-if="!isEdit">
                <Input type="text" v-model="user.username" :maxlength="20" placeholder="请输入对方用户名，如tony"/>
              </FormItem>
              <FormItem label="默认密码" prop="password" v-if="!isEdit">
                <Input type="password" v-model="user.password" :maxlength="32" placeholder="请输入默认密码"/>
              </FormItem>
              <FormItem label="手机号" prop="phone">
                <Input type="text" v-model="user.phone" :maxlength="11" placeholder="请输入手机号"/>
              </FormItem>
              <FormItem label="备注" prop="desc">
                <Input type="textarea" v-model="user.desc" :rows="3" class="user-desc"/>
              </FormItem>
              <!-- <FormItem label="权限">    
                <RadioGroup v-model="user.roleId">
                  <Radio v-for="item in roleList" :key="item.id" :label="item.id">{{item.name}}</Radio>
                </RadioGroup>
              </FormItem> -->
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit()">确定</Button>
                <Button type="ghost" @click="handleCancel()">取消</Button>
                <Button type="error" @click="handleDisable()" v-if="isEdit" class="left">移除</Button>
            </div>
          </Modal>
          <GroupAdd v-model="isGroupAddVisable" @onOk="handleGroupAddOk" @onCancel="handleGroupAddCancel" :teamId="teamId" :users="list"></GroupAdd>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import url from '../../api/url'
import role from '../../common/constant/role'
import GroupAdd from '@/views/team/GroupAdd'
export default {
  name: 'Team',
  components: {
    GroupAdd
  },
  data() {
    return {
      roleList: role,
      teamId: 1,
      isGroupAddVisable: false,
      modal: false,
      isEdit: false,
      user: {
        id: 0,
        name: '',
        username: '',
        password: '',
        phone: '',
        desc: ''
      },
      isLoading: false,
      list: [],
      search: {
        name: '',
        status: 1
      },
      columns: [
        {
          title: '姓名',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h(
                'strong',
                {
                  attrs: {
                    class: 'team-cell-user-name'
                  }
                },
                params.row.name
              ),
              h(
                'span',
                {
                  attrs: {
                    class: 'team-cell-user-role'
                  }
                },
                params.row.team_user.role_name
              )
            ])
          }
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '备注',
          key: 'desc'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row)
                  }
                }
              },
              '设置'
            )
          }
        }
      ],
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
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
    modalTitle() {
      return this.isEdit ? '修改成员' : '添加成员'
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleGroupAddOk() {
      this.isGroupAddVisable = false
    },
    handleGroupAddCancel() {
      this.isGroupAddVisable = false
    },
    handleGroupAddShow() {
      this.isGroupAddVisable = true
    },
    handleChangeMenu(name) {
      console.log(name)
    },
    clearUser() {
      this.user.id = ''
      this.user.name = ''
      this.user.username = ''
      this.user.password = ''
      this.user.phone = ''
      this.user.desc = ''
    },
    async init() {
      this.getUserList()
    },
    getUserList() {
      this.isLoading = true
      this.search.teamId = 1
      this.$http.get(url.user, this.search).then(res => {
        this.list = res.data.data
        this.isLoading = false
        console.log(this.list)
      })
    },
    onModalVisibleChange(visible) {
      if (!visible) {
        this.clearUser()
      }
    },
    handleSearch() {
      this.getUserList()
    },
    handleSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            let params = {}
            delete this.user.id
            params.user = this.user
            params.teamId = this.teamId
            this.$http.post(url.user_create, params).then(res => {
              this.modal = false
              this.$refs.userForm.resetFields()
              this.$Message.success('操作成功')
              this.getUserList()
            })
          } else {
            let user = {}
            user.id = this.user.id
            user.name = this.user.name
            user.phone = this.user.phone
            user.desc = this.user.desc
            this.$http
              .put(url.user_update.replace(':id', user.id), user)
              .then(res => {
                this.modal = false
                this.$refs.userForm.resetFields()
                this.$Message.success('操作成功')
                this.getUserList()
                console.log(res.data)
              })
          }
        }
      })
    },
    handleDisable() {
      this.$Modal.confirm({
        title: `确定要移除 ${this.user.name} 吗`,
        content:
          '被移除的成员，将不能再访问本团队中的项目信息，但跟他相关的数据不会被删除。',
        onOk: () => {
          let user = {}
          user.id = this.user.id
          this.$http
            .delete(
              url.team_remove_user
                .replace(':teamId', this.teamId)
                .replace(':userId', user.id)
            )
            .then(res => {
              this.modal = false
              this.$refs.userForm.resetFields()
              this.$Message.success('操作成功')
              this.getUserList()
            })
        }
      })
    },
    handleCancel() {
      this.$refs.userForm.resetFields()
      this.modal = false
    },
    handleAdd() {
      this.isEdit = false
      this.modal = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.modal = true
      this.user.id = row.id
      this.user.name = row.name
      this.user.phone = row.phone
      this.user.desc = row.desc
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
