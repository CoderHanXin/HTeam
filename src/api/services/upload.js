import http from '../index'
import url from '../url'

class UploadService {
  /**
   * 获取七牛文件上传token
   * @return  {String}
   */
  getToken() {
    return http.get(url.upload_token)
  }
}

export default new UploadService()
