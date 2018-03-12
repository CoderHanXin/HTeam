import http from '../index'
import url from '../url'

/**
 * 统计分析相关 Api
 */
class StatsService {
  /**
   * 获取任务概况
   * @param   {Number} teamId  团队id
   * @param   {Number} start   开始时间
   * @param   {Number} end     截止时间
   * @param   {Number} userId  成员id
   * @return  {Object:{processing, done, expired}}
   */
  getSummary(teamId, start, end, userId) {
    if (start) {
      return http.get(url.stats_summary, {
        teamId,
        start,
        end,
        userId
      })
    } else {
      return http.get(url.stats_summary, {
        teamId
      })
    }
  }

  /**
   * 获取每日任务趋势
   * @param   {Number} teamId 团队id
   * @param   {Number} start  开始时间
   * @param   {Number} end    截止时间
   * @return  {Object:{create[], done[]}
   */
  getTrend(teamId, start, end) {
    return http.get(url.stats_trend, {
      teamId,
      start,
      end
    })
  }

  /**
   * 获取项目统计
   * @param   {Number} teamId 团队id
   * @return  {Array}
   */
  getProject(teamId) {
    return http.get(url.stats_project, {
      teamId
    })
  }

  getProjectsWithTasks(teamId, start, end) {
    return http.get(url.stats_projects_with_tasks, {
      teamId,
      start,
      end
    })
  }
}

export default new StatsService()
