import request from '@/utils/request'



export function getDictList(params) {
  return request({
    url: '/dict/select_info',
    method: 'get',
    params
  })
}

export function selectByParentCode(params) {
  return request({
    url: '/dict/selectByParentCode',
    method: 'get',
    params:{code:params}
  })
}

export function add(params) {
  return request({
    url: '/dict/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/dict/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/dict/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

