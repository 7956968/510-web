import request from '@/utils/request'
//视频播放接口

//视频直播
export function getCamaraLive(uid,camearid) {
  return request({
    url: '/channelLive',
    method: 'post',
    data:{
    	uid:uid,
    	cid:camearid
    }
  })
}

//视频组直播
export function getGroupLive(uid,idList) {
  return request({
    url: '/groupLive',
    method: 'post',
    data:{
    	uid:uid,
    	idList:idList
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
