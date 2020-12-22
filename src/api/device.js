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

// 修改分组（的名字）
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
