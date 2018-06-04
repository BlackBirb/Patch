/* eslint-disable no-throw-literal */
import Axios from 'axios'

const axios = Axios.create({
  baseURL: '/api/'
})

export default {
  isLogged () {
    return axios.get('auth').then(res => res.data).catch(res => { throw false })
  },
  loadGuilds () {
    return axios.get('guilds').then(res => res.data)
  },
  loadAccount () {
    return axios.get('account').then(res => res.data)
  }
}
