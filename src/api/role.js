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

// 添加角色(暂时不使用)
export function add(params) {
  return request({
    url: '/role/add',
    method: 'post',
    params
  })
}

/**
 * 添加角色，并添加角色权限
 * @param role 角色实体
 * @param permissionIdList 权限的id列表
 */
export function addWithPermissions(role, permissionIdList) {
  return request({
    url: '/role/add_with_permissions',
    method: 'post',
    data: {
      role: role,
      permissionIdList: permissionIdList,
    }
  })
}

export function updateById(role, permissionIdList) {
  return request({
    url: '/role/update_by_id',
    method: 'post',
    data:{role:role, permissionIdList:permissionIdList}
  })
}
export function deleteById(id) {
  return request({
    url: '/role/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}
export function deleteAll(idList) {
  return request({
    url: '/role/delete_all',
    method: 'post',
    data:{idList:idList}
  })
}


