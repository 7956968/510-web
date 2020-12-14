import request from '@/utils/request'



export function getList(params) {
  return request({
    url: '/permission/select',
    method: 'get',
    params
  })
}
export function add(params) {
  return request({
    url: '/permission/add',
    method: 'post',
    params
  })
}

export function updateById(params) {
  return request({
    url: '/permission/updateById',
    method: 'post',
    params
  })
}

export function deleteById(id) {
  return request({
    url: '/permission/deleteById',
    method: 'get',
    params:{id:id}
  })
}

/**
 * 获取最后一个被添加的权限
 * @param params
 */
export function getLast() {
  return request({
    url: '/permission/select_last',
    method: 'get',
  })
}
