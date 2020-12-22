import request from '@/utils/request'

/**
 * 设备通道的接口
 *
 */


export function getChannelList(params) {
  return request({
    url: '/channel/select',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/channel/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/channel/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/channel/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

