const state = {
  tags: [],
  taskDateFilter: 'all'
}

const getters = {
  tags: state => state.tags,
  taskDateFilter: state => state.taskDateFilter
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
  },
  setTaskDateFilter(state, dateFilter) {
    state.taskDateFilter = dateFilter
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
