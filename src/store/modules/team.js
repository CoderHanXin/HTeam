const state = {
  allUsers: [],
  allGroups: []
}

const getters = {
  allUsers: state => state.allUsers,
  allGroups: state => state.allGroups
}

const mutations = {
  setAllUsers(state, users) {
    state.allUsers = users
  },
  setAllGroups(state, groups) {
    state.allGroups = groups
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
