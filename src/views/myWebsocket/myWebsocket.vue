<template>
  <div></div>
</template>

<script>
import {getUser} from '@/utils/auth';

export default {
  name: "myWebsocket",
  data() {
    return {
      // 存储通知
      notifications: {},
    }
  },
  methods:{
    websocketTest(){
      this.init();
    },
    /**
     * 初始化my-websocket
     */
    init: function () {
      if(typeof(WebSocket) === "undefined"){
        alert("您的浏览器不支持socket")
      }else{
        // 实例化socket
        //// ws://{baseURL}/websocket/stream/{sessionId}
        // 使用当前时间和用户id拼接以确保sessionId唯一
        this.path = "ws://localhost:8888/websocket/stream/"+String(new Date().getTime())+String(JSON.parse(getUser()).id);
        this.socket = new WebSocket(this.path)
        // 监听socket的(开启，错误，消息，关闭)事件
        this.socket.onopen = this.open;
        this.socket.onerror = this.error;
        this.socket.onmessage = this.getMessage;
        this.socket.onclose = this.close;
      }
    },
    open: function () {
      console.log("websocket opened")
      // let data = {
      //   method: 'getStream',
      // }
      // this.send(JSON.stringify(data))
      // let inputstr = prompt("请输入","");
      // this.socket.send(JSON.stringify({method:inputstr}));
    },
    error: function (e) {
      console.log("websocket error",e)
    },
    getMessage: function (msgEvent) {
      let createTime = new Date().getTime();
      let notifications = this.notifications;
      // 消息类型为报警，则接收 if()/////// 待实现
      this.notifications[createTime] = this.$notify({
        title: '监测到报警信息',
        message: this.$createElement('div',null,[
          ////记得修改对象文本内容
          this.$createElement('div',null,msgEvent.data),
          this.$createElement(
            'el-button',
            {
              'type':'text',
              // 事件监听器在 `on` 属性内，
              on:{
                click: ()=>{
                  ////// 如果是在报警页，需要关闭

                  // 跳转至接警页
                  this.$router.push({path:'/alarmCenter/receiveAlarm'});
                  // 关闭通知弹窗
                  notifications[createTime].close();
                }
              }
            },
            '跳转到接警页'
          ),
        ]),
        dangerouslyUseHTMLString: true,
        type: 'warning',
        offset: 100,  // 向下偏移100
        duration: 5000,// =0不会自动关闭，>0表示x毫秒后自动关闭////记得修改停留时间，5秒太少（或者永久存在）
        onClose: ()=>{
          delete notifications[createTime];
        }
      });
    },
    /**
     * @param data 字符串形式的json数据
     */
    send: function (data) {
      this.socket.send(data)
      console.log("ws send data:" + data)
    },
    /**
     * websocket关闭时触发的事件
     * @param e 事件
     */
    close: function (e) {
      console.log("websocket closed",e)
    },
  },
  created() {
    this.websocketTest();
  }
}
</script>

<style scoped>

</style>
