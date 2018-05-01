import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import state from './initialState'

Vue.use(Vuex)

export default new Vuex.Store({
  debug: true,
  state,
  mutations,
  actions,
  getters
})
