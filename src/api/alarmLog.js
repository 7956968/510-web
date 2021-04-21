import request from '@/utils/request'

/**
 * 报警日志的接口
 *
 */

/**
 * 获取报警日志列表
 * @param params 查询参数
 */
export function getAlarmLogList(params) {
  return request({
    url: '/alarm_log/select',
    method: 'get',
    params
  })
}

/**
 * 通过id删除报警日志
 * @param id
 */
export function deleteById(id) {
  return request({
    url: '/alarm_log/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

/**
 * 批量删除
 * @param idList
 */
export function deleteAll(idList) {
  return request({
    url: '/alarm_log/delete_all',
    method: 'post',
    data:{idList:idList}
  })
}

/**
 * 为报警日志添加'报警处理日志'
 * @param alarmHandleLog 报警处理日志
 */
export function handleAlarmLog(alarmHandleLog){
  return request({
    url: '/alarm_log/handle',
    method: 'post',
    data:{alarmHandleLog:alarmHandleLog}
  })
}

