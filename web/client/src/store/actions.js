import api from "../api"
/* eslint-disable */

export function logout({ commit }) {
  commit('setLogged', false)
}

export function checkLogin({ commit }) {
  api.getLogin()
    .then(res => {
      commit('setLogged', true)
      const data = res.user || {}
      commit('setUserData', {
        username: data.username || null,
        discriminator: data.discriminator || null,
        id: data.id || null,
        avatar: data.avatar,
        avatarUrl: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${data.avatar.startsWith('a_') ? 'gif' : 'webp' }` : null
      })
    })
    .catch((err) => {
      commit('setLogged', false)
      return;
    })
  }

export function getGuilds ({ commit }) {
  api.loadGuilds()
    .then(res => {
      commit('setGuilds', res)
    })
    .catch(err => {
      console.err(err)
    })
}

export function getAccount ({ commit }) {
  api.loadAccount()
    .then(res => {
      commit('setAccountData', res)
    })
    .catch(err => {
      console.error(err)
    })
}
