export function setUserData(state, payload) {
  state = Object.assign(state, payload)
}

export function setLogged(state, value) {
  state.logged = !!value
}
