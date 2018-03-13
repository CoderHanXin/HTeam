import axios from 'axios'
import Cookies from 'js-cookie'
import { router } from '../router/index'
import { Message } from 'iview'

// const baseUrl = process.env.BASE_API
// axios.defaults.baseURL = baseUrl
// axios.defaults.timeout = 5000
// axios.defaults.withCredentials = true
// axios.defaults.headers = {
//   'Content-Type': 'application/json;charset=utf-8'
// }

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    // 若是有做鉴权token , 就给头部带上token
    let token = Cookies.get('token')
    if (token) {
      config.headers = { Authorization: 'Bearer ' + token }
    }
    return config
  },
  error => {
    Message.error(error.data.error.message)
    return Promise.reject(error.data.error.message)
  }
)

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      Cookies.remove('token')
      router.push({
        name: 'login'
      })
    }
    return Promise.reject(error)
  }
)

const http = {
  get(url, payload = undefined) {
    return service({
      method: 'get',
      url: url,
      params: payload
    })
  },
  post(url, payload = undefined) {
    return service({
      method: 'post',
      url: url,
      data: payload
    })
  },
  put(url, payload = undefined) {
    return service({
      method: 'put',
      url: url,
      data: payload
    })
  },
  delete(url, payload = undefined) {
    return service({
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
