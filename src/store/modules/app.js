const state = {
  currentUser: {},
  currentTeam: {}
}

const getters = {
  currentUser: state => state.currentUser,
  currentTeam: state => state.currentTeam
}

const mutations = {
  setCurrentUser(state, user) {
    state.currentUser = user
  },
  setCurrentTeam(state, team) {
    state.currentTeam = team
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
