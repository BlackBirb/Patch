import Vue from 'vue'
import Vuex from 'vuex'
import * as Actions from './actions'
import * as Mutations from './mutations'
import * as Getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: null
  },
  mutations: Mutations,
  actions: Actions,
  getters: Getters
})
