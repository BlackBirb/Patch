import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://127.0.0.1/api/'
})

export default {
  isLogged: function () {
    // eslint-disable-next-line no-throw-literal
    return axios.get('auth').then(res => true).catch(res => { throw false })
  }
}
