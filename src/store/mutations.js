import * as types from './mutation-types'

const mutations = {
  [types.SET_CURRENT_USER](state, currentUser) {
    state.currentUser = currentUser
  }
}

export default mutations
