import axios from 'axios'
import { Message } from 'iview'

const baseUrl = 'http://127.0.0.1:7001'
const Axios = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  responseType: 'json',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

Axios.interceptors.request.use(
  config => {
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
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

// 将axios的实例重新封装成plugin
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}
