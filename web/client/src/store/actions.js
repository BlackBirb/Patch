import api from "../api"

export function checkLogin({ commit }) {
  api.isLogged()
    .then(() =>
      commit('setLogged', true)
    )
    .catch(() =>
      commit('setLogged', false)
    )
}
