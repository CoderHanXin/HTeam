const state = {
  taskDateFilter: 'all'
}

const getters = {
  taskDateFilter: state => state.taskDateFilter
}

const mutations = {
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
