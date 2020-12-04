import request from '@/utils/request'



export function getUserList(params) {
  return request({
    url: '/user/select',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/user/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/user/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/user/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

