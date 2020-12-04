import request from '@/utils/request'

/**
 * 角色与权限相关接口
 *
 */


export function getPermissionListByRoleId(roleId) {
  return request({
    url: '/role_permission/select_by_role_id',
    method: 'get',
    params:{roleId:roleId}
  })
}

export function add(params) {
  return request({
    url: '/role_permission/add',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/role_permission/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

