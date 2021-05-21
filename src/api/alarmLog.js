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
 * 添加报警处理日志
 * @param alarmLogIdList
 * @param alarmHandleLog
 */
export function addAlarmHandleLog(alarmLogIdList,alarmHandleLog){
  return request({
    url: '/alarm_log/add_alarm_handle_log',
    method: 'post',
    data:{alarmLogIdList:alarmLogIdList,alarmHandleLog:alarmHandleLog}
  })
}

/**
 * 获取报警处理日志
 * @param id 报警处理日志的id
 */
export function selectAlarmHandleLogById(id){
  return request({
    url: '/alarm_log/select_alarm_handle_log',
    method: 'get',
    params:{id:id}
  })
}
