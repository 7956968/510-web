import request from '@/utils/request'



export function getUserList(params) {
  return request({
    url: '/user_manage/select',
    method: 'get',
    params:params
  })
  // return request({
  //   url: '/device/select',
  //   method: 'get',
  //   params
  // })
}

export function add(params) {
  return request({
    url: '/user_manage/add',
    method: 'post',
    params
  })
}
export function updateById(params) {
  return request({
    url: '/user_manage/update_by_id',
    method: 'post',
    params
  })
}
export function deleteById(id) {
  return request({
    url: '/user_manage/delete_by_id',
    method: 'post',
    params:{id:id}
  })
}
export function deleteAll(idList) {
  return request({
    url: '/user_manage/delete_all',
    method: 'post',
    data:{idList:idList}
  })
}
