const state = {
  tags: [],
  taskTagFilter: '',
  taskDateFilter: ''
}

const getters = {
  tags: state => state.tags,
  taskTagFilter: state => state.taskTagFilter,
  taskDateFilter: state => state.taskDateFilter
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
  },
  setTaskTagFilter(state, tagFilter) {
    state.taskTagFilter = tagFilter
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
