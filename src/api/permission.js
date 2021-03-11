import request from '@/utils/request'



export function getList(params) {
  return request({
    url: '/permission/select',
    method: 'get',
    params
  })
}

/**
 * 添加权限，并为创建者所属角色赋予权限
 * @param data {permission:xxx, roleId:xxx}
 *           permission 权限实体
 *           roleId 创建者所属角色的id
 */
export function add(data) {
  return request({
    url: '/permission/add',
    method: 'post',
    data: data,
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
