import request from '@/utils/request'



export function getDepartmentList(params) {
  return request({
    url: '/department/select',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/department/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/department/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/department/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

