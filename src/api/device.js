import request from '@/utils/request'

/**
 * 设备管理的接口
 *    包括设备分组
 *
 */

/**
 *
 * @param params
 *        keyword 关键字
 *        groupId 组id
 *        type    设备类型
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
export function deleteAll(idList) {
  return request({
    url: '/device/delete_all',
    method: 'post',
    data:{idList:idList}
  })
}

/**
 * 分组设置
 * 包括：添加, 修改, 删除, 获取
 */


// 获取所有分组
export function getGroupList(params) {
  return request({
    url: '/group/select',
    method: 'get',
    params
  })
}

/**
 * 获取分组与分组内所有的"摄像头"设备
 * @param params 查询参数（暂时不用）
 */
export function getGroupListWithDevices(params) {
  return request({
    url: '/group/select_with_devices',
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
 * 目前只有一个接口：移动
 *    移动到null相当于移除出分组
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
 *
 * @param data 结构体
 *    deviceIdList: [xxx,xxx,xxx,...],
 *    groupId: *, 如果为null, 则移至未分组设备
 *
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
// export function removeDevices(data) {
//   return request({
//     url: '/group/remove_devices',
//     method: 'post',
//     data: data,
//   })
// }

/**
 * 管理摄像头-报警设备联动关系
 * 添加，删除，查找
 */

/**
 * 添加1个摄像头-报警设备联动
 * @param data
 *    alarmId:报警设备id
 *    deviceId:摄像头id
 *    createUser:创建者id
 */
// export function addLiandong(data) {
//   return request({
//     url: '/device/addLiandong',
//     method: 'post',
//     data: data,
//   })
// }

/**
 * 添加多个摄像头-报警设备联动
 * @param data
 *        {
 *          alarmId: 报警设备id
 *          deviceIdList: 摄像头id列表(Array)
 *          createUser: 创建者id
 *        }
 */
export function addAllLiandong(data) {
  return request({
    url: '/device/addAllLiandong',
    method: 'post',
    data: data,
  })
}

/**
 * 删除联动
 * @param id
 */
export function deleteLiandong(data) {
  return request({
    url: '/device/deleteLiandong',
    method: 'post',
    data: data,
  })
}

export function deleteAllLiandongByIdList(idList) {
  return request({
    url: '/device/deleteAllLiandong',
    method: 'post',
    data:{idList:idList}
  })
}

/**
 * 通过报警设备id查找联动的设备
 * @param alarmId 报警设备id
 */
export function selectLiandong(alarmId) {
  return request({
    url: '/device/selectLiandong',
    method: 'get',
    params:{alarmId:alarmId}
  })
}
