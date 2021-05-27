/*
 * 如果有更多的摄像头品牌，需要补充字符串和方法
 *
 *
 * 多种rtsp地址格式参考的网址：
 *  https://blog.csdn.net/viola_lulu/article/details/53330727
 *  https://www.cnblogs.com/wanggang123/p/8442683.html
 */



/**
 * 第一种海康威视摄像头地址格式(旧版本)
 * username: 用户名. 例如admin.
 * password: 密码. 例如12345.
 * ip: 设备IP. 例如 192.0.0.64
 * port: 端口号默认为554，若为默认可不填写.
 * codec：有h264、MPEG-4、mpeg4这几种.
 * channel: 通道号，起始为1. 例如通道1，则为ch1.
 * subtype: 码流类型，主码流为main，辅码流为sub.
 */
const HIKVISION_FORMAT =
  "rtsp://[username]:[password]@[ip]:[port]/[codec]/[channel]/[subtype]/av_stream";
/**
 * 第2种海康威视摄像头地址格式(新版本)
 * username: 用户名. 例如admin.
 * password: 密码. 例如12345.
 * ip: 设备IP. 例如 192.0.0.64
 * port: 端口号默认为554，若为默认可不填写.
 * subtype: 码流类型，主码流为1，辅码流为2，第三码流为3.
 */
const HIKVISION_NEW_FORMAT =
  "rtsp://[username]:[password]@[ip]:[port]/Streaming/Channels/[subtype]";

/**
 * 大华摄像头地址格式
 * username: 用户名。例如admin。
 * password: 密码. 例如12345
 * ip: 为设备IP。例如 10.7.8.122
 * port: 端口号默认为554，若为默认可不填写。
 * channel: 通道号，起始为1。例如通道2，则为channel=2
 * subtype: 码流类型，主码流为0（即subtype=0），辅码流为1（即subtype=1）
 */
const DAHUA_FORMAT =
  "rtsp://[username]:[password]@[ip]:[port]/cam/realmonitor?channel=[channel]&subtype=[subtype]";

/**
 * 友讯摄像头地址格式
 * username：用户名。例如admin
 * password：密码。例如12345，如果没有网络验证可直接写成rtsp://[ip]:[port]/[channel].sdp
 * ip：为设备IP。例如192.168.0.108
 * port：端口号默认为554，若为默认可不填写。
 * channel：通道号，起始为1。例如通道2，则为live2。
 */
const DLINK_FORMAT =
  "rtsp://[username]:[password]@[ip]:[port]/live[channel].sdp";

/**
 * 安迅士摄像头地址格式
 * username：用户名。例如admin
 * password：密码。例如12345，如果没有网络验证可省略用户名密码部分以及@字符。
 * ip：为设备IP。例如192.168.0.108
 * videocodec：支持MPEG、h264等，可缺省。
 * resolution：分辨率，如resolution=1920x1080，若采用默认分辨率，可缺省此参数。
 */
const AXIS_FORMAT =
  "rtsp://[username]:[password]@[ip]/axis-media/media.amp?videocodec=[videocodec]&resolution=[resolution]";

/**
 * 拼接rtsp地址，摄像头品牌：海康威视，第一种格式（旧版本）
 * @param camera 摄像头
 * @return {string[]} 视频流地址数组
 */
export function concatHikVisionAddress(camera){
  let rtspList = [];
  camera.channels.forEach(channel=>{
    let rtspAddr =
      "rtsp://"
      + camera.loginName
      + ":"
      + camera.password
      + "@"
      + camera.ip
      + ":"
      + camera.port
      + "/"
      + "h264"
      + "/ch"
      + channel.number
      + "/"
      + "main"
      + "/"
      + "av_stream"
    ;
    rtspList.push(rtspAddr);
  })
  return rtspList;
}

/**
 * 拼接rtsp地址，摄像头品牌：海康威视, 第二种格式（新版本）
 * @param camera 摄像头
 * @return {string[]} 视频流地址数组
 */
export function concatHikVisionAddress2(camera){
  let rtspList = [];
  camera.channels.forEach(channel=>{
    let rtspAddr =
      "rtsp://"
      + camera.loginName
      + ":"
      + camera.password
      + "@"
      + camera.ip
      + ":"
      + camera.port
      + "/Streaming/Channels/"
      + channel.number
    ;
    rtspList.push(rtspAddr);
  })
  return rtspList;
}

/**
 * 拼接rtsp地址，摄像头品牌：大华
 * @param camera 摄像头
 * @return {string[]} 视频流地址数组
 */
export function concatDaHuaAddress(camera){
  let rtspList = [];
  camera.channels.forEach(channel=>{
    let rtspAddr =
      "rtsp://"
      + camera.loginName
      + ":"
      + camera.password
      + "@"
      + camera.ip
      + ":"
      + camera.port
      + "/cam/realmonitor?channel=ch"
      + channel.number
      + "&subtype="
      + "1"
    ;
    rtspList.push(rtspAddr);
  })
  return rtspList;
}

/**
 * 拼接rtsp地址，摄像头品牌：友讯
 * @param camera 摄像头
 * @return {string[]} 视频流地址数组
 */
export function concatDLinkAddress(camera){
  let rtspList = [];
  camera.channels.forEach(channel=>{
    let rtspAddr =
      "rtsp://"
      + camera.loginName
      + ":"
      + camera.password
      + "@"
      + camera.ip
      + ":"
      + camera.port
      + "/live"
      + channel.number
      + ".sdp"
    ;
    rtspList.push(rtspAddr);
  })
  return rtspList;
}

/**
 * 拼接rtsp地址，摄像头品牌：安迅士
 * @param camera 摄像头
 * @return {string[]} 视频流地址数组
 */
export function concatAxisAddress(camera){
  let rtspList = [];

  let rtspAddr =
    "rtsp://"
    + camera.loginName
    + ":"
    + camera.password
    + "@"
    + camera.ip
    + "/axis-media/media.amp?videocodec="
    + "h264"
    // + "&resolution="
    // + "1920x1080"
  ;
  rtspList.push(rtspAddr);
  return rtspList;
}

/**
 * 根据摄像头的拼接rtsp地址
 * @param camera 摄像头对象
 * @return {string[]} 视频流地址数组（摄像头可能有多个通道，所以返回字符串数组而不是单个字符串）
 */
export function concatAddress(camera){
  if(camera==null)
    return [];
  //// rtsp格式为
  if(camera.rtspFormat===null || camera.rtspFormat===''){
    return [];
  }
  switch (camera.rtspFormat){
    case 'HIKVISION':
      return concatHikVisionAddress(camera);
    case 'HIKVISION_NEW':
      return concatHikVisionAddress2(camera);
    case 'DAHUA':
      return concatDaHuaAddress(camera);
    case 'DLINK':
      return concatDLinkAddress(camera);
    case 'AXIS':
      return concatAxisAddress(camera);
    default:
      return concatHikVisionAddress(camera);
  }
}

const rtspFormatOptions = [
  {
    label: '海康（旧）',
    value: 'HIKVISION',
    formatString: HIKVISION_FORMAT,
  },
  {
    label: '海康（新）',
    value: 'HIKVISION_NEW',
    formatString: HIKVISION_NEW_FORMAT,
  },
  {
    label: '大华',
    value: 'DAHUA',
    formatString: DAHUA_FORMAT,
  },
  {
    label: '友讯',
    value: 'DLINK',
    formatString: DLINK_FORMAT,
  },
  {
    label: '安迅士',
    value: 'AXIS',
    formatString: AXIS_FORMAT,
  },
]

export default {
  rtspFormatOptions,
}
