import http from '../index'
import url from '../url'

/**
 * 统计分析相关 Api
 */
class StatsService {
  /**
   * 获取任务概况
   * @param   {Number} teamId 团队id
   * @return  {Object:{all, done, expired}}
   */
  getSummary(teamId) {
    return http.get(url.stats_summary, {
      teamId
    })
  }
}

export default new StatsService()
