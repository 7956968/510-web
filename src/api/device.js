import request from '@/utils/request'

/**
 * 设备管理的接口
 *    包括设备分组
 *
 */


export function getDeviceList(params) {
  return request({
    url: '/device/select',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/device/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/device/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/device/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

/**
 * 分组设置
 *
 */


// 获取所有分组
export function getGroupList(params) {
  return request({
    url: '/group/select',
    method: 'get',
    params
  })
}

// 添加分组
export function addGroup(params) {
  return request({
    url: '/group/add',
    method: 'post',
    params
  })
}

// 修改分组(的name，pid)
export function updateGroupById(params) {
  return request({
    url: '/group/update_by_id',
    method: 'post',
    params
  })
}

// 删除分组
export function deleteGroupById(id) {
  return request({
    url: '/group/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}

/**
 * 删除所有id在idList中的分组
 * @param data {idList: [xxx,xxx,xxx,...]}
 */
export function deleteAllGroups(data) {
  return request({
    url: '/group/delete_all',
    method: 'post',
    data: data,
  })
}

/**
 * 分组-设备 关系
 *
 */

/**
 * 把未分组的设备添加到某组
 * @param data {deviceIdList: [xxx,xxx,xxx,...], groupId: *}
 */
// export function addDevicesToGroups(data) {
//   return request({
//     url: '/group/add_devices',
//     method: 'post',
//     data: data,
//   })
// }

/**
 * 把已分组的设备转移至某组
 * @param data {deviceIdList: [xxx,xxx,xxx,...], groupId: *}
 */
export function moveDevicesToGroups(data) {
  return request({
    url: '/group/move_devices',
    method: 'post',
    data: data,
  })
}

/**
 * 把已分组的设备移除出某组
 * @param data {deviceIdList: [xxx,xxx,xxx,...]}
 */
export function removeDevices(data) {
  return request({
    url: '/group/remove_devices',
    method: 'post',
    data: data,
  })
}
