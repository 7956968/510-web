import request from '@/utils/request'

/**
 * 操作日志的接口
 *
 */

/**
 * 获取操作日志列表
 * @param params 查询参数
 */
export function getOperationLogList(params) {
  return request({
    url: '/operation_log/select',
    method: 'get',
    params
  })
}

/**
 * 通过id删除操作日志
 * @param id
 */
export function deleteById(id) {
  return request({
    url: '/operation_log/delete_by_id',
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
    url: '/operation_log/delete_all',
    method: 'post',
    data:{idList:idList}
  })
}
