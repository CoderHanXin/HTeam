const state = {
  allUsers: {},
  groups: {}
}

const getters = {
  allUsers: state => state.allUsers,
  groups: state => state.groups
}

const mutations = {
  setAllUsers(state, users) {
    state.allUsers = users
  },
  setGroups(state, groups) {
    state.groups = groups
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
