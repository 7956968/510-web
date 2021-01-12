import request from '@/utils/request'

/**
 * 设备通道的接口
 *
 */


export function getChannelList(deviceId) {
  return request({
    url: '/channel/selectByDeviceId',
    method: 'get',
    params:{deviceId:deviceId}
  })
}

export function add(params) {
  return request({
    url: '/channel/add',
    method: 'post',
    //// params改一下
    params
  })
}
export function updateById(params) {
  return request({
    url: '/channel/update_by_id',
    method: 'post',
    //// params改一下
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/channel/delete_by_id',
    method: 'post',
    //// params改一下
    params:{id:id}
  })
}

/**
 * 批量删除设备通道（未测试）
 * @param idList 通道的id列表
 */
export function deleteAll(idList) {
  return request({
    url: '/channel/delete_all',
    method: 'post',
    //// params改一下
    params:{idList:idList}
  })
}
