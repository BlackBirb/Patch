export function setUserData(state, payload) {
  state = Object.assign(state, payload)
}

export function setLogged(state, value) {
  state.logged = Boolean(value)
}

export function setGuilds(state, payload) {
  state.guilds = payload
}

export function setAccountData(state, payload) {
  console.log("why")
  state.account = payload.account
  state.settings = payload.settings
}
