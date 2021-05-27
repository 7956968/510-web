import request from '@/utils/request'
//视频播放接口

//视频组直播
export function getGroupLive(uid,idList,addrList) {
  return request({
    url: '/live/start',
    method: 'post',
    data:{
    	uid:uid,
    	idList:idList,
      addrList:addrList
    }
  })
}

// //拖拽添加单个视频的播放
// export function addLive(uid,cid,addrList) {
//   return request({
//     url: '/live/add',
//     method: 'post',
//     data:{
//       uid:uid,
//       cid:cid,
//       addrList:addrList
//     }
//   })
// }

//
export function stop(uid,idList,addrList) {
  return request({
    url: '/live/stop',
    method: 'post',
    data:{
      uid:uid,
      idList:idList,
      addrList:addrList
    }
  })
}

export function getPlayback(did,date) {
  return request({
    url: '/live/getPlayback',
    method: 'post',
    data:{
      did:did,
      date:date
    }
  })
}

export function saveMatrix(mList,dList){
  return request({
    url: '/matrix/saveMatrix',
    method: 'post',
    data:{
      mList:mList,
      dList:dList
    }
  })
}

export function getMatrix(uid){
  return request({
    url: '/matrix/getMatrix',
    method: 'post',
    data:{
      uid:did,
      name:name
    }
  })
}

export function deleteMatrix(uid,name){
  return request({
    url: '/matrix/deleteMatrix',
    method: 'post',
    data:{
      uid:did,
      name:name
    }
  })
}

//
// //视频回放
// export function getHistory(cameraid) {
//   return request({
//     url: '/live',
//     method: 'post',
//     data:"cameraid="+camearaid
//   })
// }
