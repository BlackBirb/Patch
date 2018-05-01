import Axios from 'axios'

const axios = Axios.create({
  baseURL: '/api/'
})

export default {
  isLogged: function () {
    // eslint-disable-next-line no-throw-literal
    return axios.get('auth').then(res => res.data).catch(res => { throw false })
  }
}
