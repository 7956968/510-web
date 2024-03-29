import request from '@/utils/request'

/**
 * 设备管理的接口
 *    包括设备增删改查，设备分组，联动管理
 *
 */

/**
 * 根据组id获取设备总数
 * @param groupId
 */
// export function countByGroupId(groupId){
//   return request({
//     url: '/device/count_by_group_id',
//     method: 'get',
//     params:{groupId: groupId},
//   })
// }

/**
 * 设备管理页面：获取设备列表
 * @param params {keyword: * , groupId: * , type: * }
 *          keyword 关键字
 *          groupId 组id
 *          type    设备类型
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

/***************************************************
 * 分组设置
 * 包括：添加, 修改, 删除, 获取, 通过设备ID获取
 */


/**
 * 查询所有分组
 * @param params 查询参数（暂时无意义）
 */
export function getGroupList(params) {
  return request({
    url: '/group/select',
    method: 'get',
    params
  })
}

/**
 * 获取摄像头列表，摄像头包含它的通道列表
 * @param idList
 */
export function getCameraList(idList){
  return request({
    url: '/device/select_cameras',
    method: 'post',
    data:{idList:idList},
  })
}

/**
 * 通过报警设备id，获取它联动的摄像头列表
 * @param alarmId{number}
 */
export function getCameraListByAlarmId(alarmId){
  return request({
    url: '/device/select_cameras_by_alarm_id',
    method: 'get',
    params:{alarmId:alarmId},
  })
}

export function getGroupListByDeviceId(deviceId) {
  return request({
    url: '/group/select_by_device_id',
    method: 'get',
    params:{deviceId:deviceId}
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

/**
 * 添加分组
 * @param params 分组实体 {id:null, name: *, pid: *, createUser: *, updateUser: *, }
 *          pid 父分组id，为null则设置pid为0
 *          name 分组名
 *          createUser 创建者的id
 *          updateUser 修改者的id
 */
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
 * 为多个设备分配多个分组
 * @param data
 *    deviceIdList: 设备id的数组
 *    groupIdList:  组id的数组;如果为空, 则移至未分组设备
 *    createUser: 操作用户的ID
 */
export function distributeDevicesToGroups(data) {
  return request({
    url: '/group/distribute_devices_to groups',
    method: 'post',
    data: data,
  })
}

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
// export function addLinkage(data) {
//   return request({
//     url: '/device/addLinkage',
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
export function addAllLinkage(data) {
  return request({
    url: '/device/addAllLinkage',
    method: 'post',
    data: data,
  })
}

/**
 * 删除联动
 * @param data
 */
export function deleteLinkage(data) {
  return request({
    url: '/device/deleteLinkage',
    method: 'post',
    data: data,
  })
}

export function deleteAllLinkageByIdList(idList) {
  return request({
    url: '/device/deleteAllLinkage',
    method: 'post',
    data:{idList:idList}
  })
}

/**
 * 通过报警设备id查找联动的设备
 * @param alarmId 报警设备id
 */
export function selectLinkage(alarmId) {
  return request({
    url: '/device/selectLinkage',
    method: 'get',
    params:{alarmId:alarmId}
  })
}
