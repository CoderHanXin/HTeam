import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import team from './modules/team'
import task from './modules/task'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    app,
    team,
    task
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
