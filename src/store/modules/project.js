const state = {
  currentProject: {},
  projectMembers: []
}

const getters = {
  currentProject: state => state.currentProject,
  projectMembers: state => state.projectMembers
}

const mutations = {
  setCurrentProject(state, project) {
    state.currentProject = project
  },
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
