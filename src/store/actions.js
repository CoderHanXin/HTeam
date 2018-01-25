import * as types from './mutation-types'

const actions = {
  setCurrentUser({ commit }, currentUser) {
    commit(types.SET_CURRENT_USER, currentUser)
  }
}

export default actions
