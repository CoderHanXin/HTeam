<template>
  <Layout>
    <Sider class="sub-sider">
      <div class="header">
        <h5 class="title">成员管理</h5>
      </div>
      <Menu class="menu" theme="light" width="auto" :open-names="['1']">
        <Submenu name="1">
          <template slot="title">
            阿里巴巴
          </template>
          <menu-item name="1-1">
            <CzsIcon type="hacker" size="16"></CzsIcon>土豆团队</menu-item>
          <menu-item name="1-2">
            <CzsIcon type="code-plugin-l" size="16"></CzsIcon>未分配</menu-item>
        </Submenu>
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
              <Button @click="handleAdd" type="success" icon="android-add" class="margin-right-4">添加</Button>
            </Form>
          </div>
          <Table border :columns="columns" :data="list" ref="table"></Table>
          <Modal v-model="modal" :title="modalTitle" width="480" :mask-closable="false">
            <Form ref="formCustom" :model="user" :label-width="60">
              <FormItem label="姓名" prop="name">
                <Input type="text" v-model="user.name" placeholder="请输入对方真实姓名"/>
              </FormItem>
              <FormItem label="用户名" prop="username">
                <Input type="text" v-model="user.username"  placeholder="请输入对方用户名，如Tony"/>
              </FormItem>
              <FormItem label="默认密码" prop="password">
                <Input type="password" v-model="user.password" placeholder="请输入默认密码"/>
              </FormItem>
              <FormItem label="员工编号" prop="empNumber">
                <Input type="password" v-model="user.empNumber" placeholder="请输入员工编号"/>
              </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit()">添加</Button>
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
export default {
  name: 'Member',
  data() {
    return {
      modal: false,
      isEdit: false,
      user: {
        name: '',
        username: '',
        password: '',
        empNumber: ''
      },
      search: {
        name: ''
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
                    this.handleEdit(params.index)
                  }
                }
              },
              '设置'
            )
          }
        }
      ],
      list: [
        {
          name: '张三',
          empNumber: '0001',
          phone: '13900010001'
        },
        {
          name: '李四',
          empNumber: '0002',
          phone: '13900010002'
        },
        {
          name: '王五',
          empNumber: '0003',
          phone: '13900010003'
        },
        {
          name: '赵六',
          empNumber: '0004',
          phone: '13900010004'
        }
      ]
    }
  },
  computed: {
    modalTitle() {
      return this.isEdit ? '修改成员' : '添加成员'
    }
  },
  methods: {
    handleSearch() {},
    handleSubmit() {
      this.$http.post(url.user_create, this.user).then(res => {
        this.modal = false
        console.log(res.data)
      })
    },
    handleCancel() {
      this.modal = false
    },
    handleDisable() {},
    handleAdd() {
      this.isEdit = false
      this.modal = true
    },
    handleEdit(index) {
      this.isEdit = true
      this.modal = true
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
