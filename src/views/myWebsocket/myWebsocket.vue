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
        this.path = "ws://localhost:8888/websocket/browser/"+String(new Date().getTime())+String(JSON.parse(getUser()).id);
        this.socket = new WebSocket(this.path);
        this.loadWsEvent();
      }
    },
    loadWsEvent: function(){
      // 监听socket的(开启，错误，消息，关闭)事件
      this.socket.onopen = this.open;
      this.socket.onerror = this.error;
      this.socket.onmessage = this.getMessage;
      this.socket.onclose = this.close;
    },
    open: function () {
      console.log("websocket opened")
    },
    error: function (e) {
      console.log("websocket error",e)
    },
    /**
     * 接收消息
     * @param msgEvent 消息事件
     */
    getMessage: function (msgEvent) {
      let createTime = new Date().getTime();
      let notifications = this.notifications;
      let msgData = JSON.parse(msgEvent.data);
      // 消息类型为报警，临时保存并显示弹窗
      if(msgData["method"] === 'alarmMessage'){
        // 临时存储消息（sessionStorage在关闭页面后失效）
        let alarmMsgList = JSON.parse(sessionStorage.getItem("alarmMsgList")) || [];
        alarmMsgList.push(msgData);
        sessionStorage.setItem("alarmMsgList", JSON.stringify(alarmMsgList));

        // 路由判断：如果不在接警页，则创建弹窗
        if( ! this.$route.path.includes("receiveAlarm"))
        this.notifications[createTime] = this.$notify({
          title: '监听到报警信息',
          message: this.$createElement('div',null,[
            ////记得修改对象文本内容
            this.$createElement('div',null,msgData.description || '--'),
            this.$createElement(
              'el-button',
              {
                'type':'text',
                // 事件监听器在 `on` 属性内，
                on:{
                  click: ()=>{
                    // 跳转至接警页
                    this.$router.push({path:'/alarmCenter/receiveAlarm'});
                    // 关闭通知弹窗
                    notifications[createTime].close();
                  }
                }
              },
              '查看视频'
            ),
          ]),
          dangerouslyUseHTMLString: true,
          type: 'warning',
          offset: 100,  // 窗口向下偏移100
          duration: 0,// =0不会自动关闭，>0表示x毫秒后自动关闭////记得修改停留时间，5秒太少（或者永久存在）
          onClose: ()=>{
            delete notifications[createTime];
          }
        });
      }
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
     *          e.code
     *          1006  服务器的线程关闭（比如执行sql异常
     *          1008  浏览器退出； http会话结束（连接太久，测试的时候是登陆后31分钟断连）。 后者需要重连
     *          1001  刷新页面（不用重连，创建组件的时候自动连接新的ws）
     *
     */
    close: function (e) {
      console.log("websocket closed",e)
      if(e["code"]===1006 || e["code"]===1008){
        this.$message.warning("与服务器实时连接断开，无法监听报警信息，尝试重连中");
        let that = this;
        //重复执行某个方法
        let t1 = window.setInterval(()=>{
          that.socket = new WebSocket(that.path);
          that.loadWsEvent();
          //去掉定时器的方法
          if(that.socket){
            window.clearInterval(t1);
            this.$message.success("重连成功");
          }
        },5000);

      }
    },
  },
  created() {
    this.init();
  }
}
</script>

<style scoped>

</style>
