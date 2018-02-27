const state = {
  projectMembers: []
}

const getters = {
  projectMembers: state => state.projectMembers
}

const mutations = {
  setProjectMembers(state, users) {
    state.projectMembers = users
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
