import request from '@/utils/request'

/**
 * 角色管理的接口
 *
 */


export function getRoleList(params) {
  return request({
    url: '/role/select',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/role/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/role/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/role/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

