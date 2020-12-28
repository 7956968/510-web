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

