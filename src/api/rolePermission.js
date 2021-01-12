import request from '@/utils/request'

/**
 * 角色与权限相关接口
 *
 */

/**
 * 通过角色id获取对应权限
 * @param roleId 角色id
 */
export function getPermissionListByRoleId(roleId) {
  return request({
    url: '/role_permission/select_by_role_id',
    method: 'get',
    params:{roleId:roleId}
  })
}

/**
 * 为用户增加一项权限
 * 用于permission.vue, 在成功新增一项权限之后，需要调用另一个接口为
 * @param params
 */
export function add(params) {
  return request({
    url: '/role_permission/add',
    method: 'post',
    params
  })
}

/**
 * 批量添加角色权限
 * @param data
 *    {roleId:roleId, pmsIdList: pmsIdList}
 */
export function addAll(data) {
  return request({
    url: '/role_permission/add_all',
    method: 'post',
    data: data
  })
}

/**
 * 删除roleId的部分权限
 * @param data
 *    {roleId:roleId, permissionId:permissionId}
 */
export function deleteAll(data) {
  return request({
    url: '/role_permission/delete_all',
    method: 'post',
    data:data
  })
}
/**
 * 删除roleId的所有权限
 * @param data
 *    {roleId:roleId}
 */
// export function deleteByRoleId(roleId) {
//   return request({
//     url: '/role_permission/delete_by_role_id',
//     method: 'post',
//     data: {roleId:roleId}
//   })
// }
