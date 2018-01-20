import axios from 'axios'
import { Message } from 'iview'

const baseUrl = 'http://127.0.0.1:7001'
axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=utf-8'
}

axios.interceptors.request.use(
  config => {
    if (config.method === 'post' || config.method === 'put') {
    }
    // 若是有做鉴权token , 就给头部带上token
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },
  error => {
    Message.error(error.data.error.message)
    return Promise.reject(error.data.error.message)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

const http = {
  get(url, payload = undefined) {
    return axios({
      method: 'get',
      url: url,
      params: payload
    })
  },
  post(url, payload = undefined) {
    return axios({
      method: 'post',
      url: url,
      data: payload
    })
  },
  put(url, payload = undefined) {
    return axios({
      method: 'put',
      url: url,
      data: payload
    })
  },
  delete(url, payload = undefined) {
    return axios({
      method: 'delete',
      url: url,
      params: payload
    })
  },
  all(promises) {
    return Promise.all(promises)
  }
}

export default http
