import request from '@/utils/request'

/**
 * 灭火器信息的接口
 *
 */


export function getExtinguisherList(params) {
  return request({
    url: '/extinguisher/select',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/extinguisher/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/extinguisher/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/extinguisher/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

export function deleteAll(idList) {
  return request({
    url: '/extinguisher/delete_all',
    method: 'post',
    data:{idList:idList}
  })
}
