<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">成员管理</h5>
      </div>
    <Tree :data="orgTree" @on-select-change="handleNodeSelect" class="org-tree"></Tree>
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
              <Button @click="handleAdd" type="success" icon="android-add" class="margin-right-4">添加</Button>
            </Form>
          </div>
          <Table border :columns="columns" :data="list" :loading="isLoading" ref="table"></Table>
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
              <FormItem label="员工编号" prop="empNumber">
                <Input type="text" v-model="user.empNumber" :maxlength="20" placeholder="请输入员工编号"/>
              </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit()">确定</Button>
                <Button type="ghost" @click="handleCancel()">取消</Button>
                <Button type="error" @click="handleDisable()" v-if="isEdit" class="left">禁用</Button>
            </div>
          </Modal>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import url from '../../api/url'
// import User from '../../common/model/user'
export default {
  name: 'Member',
  data() {
    return {
      rootOrgId: 1,
      selectedOrgId: 1,
      orgTree: [],
      modal: false,
      isEdit: false,
      user: {
        id: '',
        name: '',
        username: '',
        password: '',
        phone: '',
        empNumber: ''
      },
      isLoading: false,
      list: [],
      search: {
        name: '',
        status: 1,
        orgId: 1
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '工号',
          key: 'empNumber'
        },
        {
          title: '手机号',
          key: 'phone'
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
        ],
        empNumber: [
          {
            type: 'string',
            pattern: /^[A-Za-z0-9]+$/gi,
            message: '员工编号只能是英文和数字',
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
    handleNodeSelect(val) {
      if (val[0]) {
        this.selectedOrgId = val[0].id
      } else {
        this.selectedOrgId = this.rootOrgId
        this.orgTree[0].selected = true
      }
      this.search.orgId = this.selectedOrgId
      this._getUserList()
    },
    clearUser() {
      this.user.id = ''
      this.user.name = ''
      this.user.username = ''
      this.user.password = ''
      this.user.phone = ''
      this.user.empNumber = ''
    },
    async init() {
      this.$http.get('/api/org/tree', { id: this.selectedOrgId }).then(res => {
        this.orgTree = []
        const tree = res.data.data
        tree.expand = true
        tree.selected = true
        this.orgTree.push(tree)
        this.rootOrgId = this.orgTree[0] && this.orgTree[0].id
        this.selectedOrgId = this.rootOrgId
        this.search.orgId = this.selectedOrgId
        this._getUserList()
      })
    },
    _getUserList() {
      this.isLoading = true
      this.$http.get(url.user_search, this.search).then(res => {
        this.list = res.data.data
        this.isLoading = false
      })
    },
    onModalVisibleChange(visible) {
      if (!visible) {
        this.clearUser()
      }
    },
    handleSearch() {
      this._getUserList()
    },
    handleSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            this.$http.post(url.user_create, this.user).then(res => {
              this.modal = false
              this.$refs.userForm.resetFields()
              this.$Message.success('操作成功')
              this._getUserList()
            })
          } else {
            let user = {}
            user.id = this.user.id
            user.name = this.user.name
            user.phone = this.user.phone
            user.empNumber = this.user.empNumber
            this.$http.put(url.user_update, user).then(res => {
              this.modal = false
              this.$refs.userForm.resetFields()
              this.$Message.success('操作成功')
              this._getUserList()
            })
          }
        }
      })
    },
    handleDisable() {
      let user = {}
      user.id = this.user.id
      user.status = 0
      this.$http.put(url.user_update, user).then(res => {
        this.modal = false
        this.$refs.userForm.resetFields()
        this.$Message.success('操作成功')
        this._getUserList()
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
      this.user.empNumber = row.empNumber
    }
  }
}
</script>

<style lang="stylus">
.org-tree
  padding-left 16px
  ul
    font-size 14px
.ivu-tree ul li .ivu-tree-title
  width 88% 
</style>
