<template>
  <Layout class="main-body">
    <div class="header">
      <div class="title">{{mainTitle}}</div>
    </div>
    <Content class="content">
      <Card class="margin-top-16" shadow>
        <div class="card-header">
          <div class="card-header-title">
            <span>项目进度</span>
          </div>
        </div>
        <div class="card-body">
          <Table border :columns="columns" :data="projectList" :loading="isLoading" ref="table" class="team-table"></Table>
        </div>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import statsService from '@/api/services/stats'
import { mapGetters } from 'vuex'
export default {
  name: 'StatsProject',
  data() {
    return {
      mainTitle: '项目统计',
      projectList: [],
      isLoading: false,
      columns: [
        {
          title: '项目',
          key: 'name',
          align: 'center'
        },
        // {
        //   title: '开始时间',
        //   key: 'start'
        // },
        // {
        //   title: '结束时间',
        //   key: 'end'
        // },
        // {
        //   title: '状态',
        //   key: 'status'
        // },
        {
          title: '待完成',
          key: 'processing',
          align: 'center'
        },
        {
          title: '已延误',
          key: 'expired',
          align: 'center'
        },
        {
          title: '已完成',
          key: 'done',
          align: 'center'
        },
        {
          title: '任务进度',
          key: 'rate',
          align: 'center',
          render: (h, params) => {
            return h('Progress',
              {
                props: {
                  percent: params.row.rate,
                  status: 'active',
                  hideInfo: true
                },
                attrs: {
                  title: params.row.rate + '%'
                }
              }
            )
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'currentTeam'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      statsService.getProject(this.currentTeam.id).then(res => {
        this.projectList = res.data.data
      })
    }
  }
}
</script>

<style>

</style>
