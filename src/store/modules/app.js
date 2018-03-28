import Cookies from 'js-cookie'

const state = {
  currentUser: Cookies.getJSON('currentUser'),
  currentTeam: Cookies.getJSON('currentTeam'),
  allUsers: [],
  allGroups: []
}

const getters = {
  currentUser: state => state.currentUser,
  currentTeam: state => state.currentTeam,
  allUsers: state => state.allUsers,
  allGroups: state => state.allGroups
}

const mutations = {
  setCurrentUser(state, user) {
    state.currentUser = user
  },
  setCurrentTeam(state, team) {
    state.currentTeam = team
  },
  setAllUsers(state, users) {
    state.allUsers = users
  },
  setAllGroups(state, groups) {
    state.allGroups = groups
  }
}

const actions = {
  logout({ commit }) {
    commit('setCurrentUser', null)
    commit('setCurrentTeam', null)
    commit('setAllUsers', [])
    commit('setAllGroups', [])
    Cookies.remove('token')
    Cookies.remove('currentUser')
    Cookies.remove('currentTeam')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
