<template>
  <div class="content_container">
    <div>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="keyword" placeholder="请输入关键字" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="box" ref="box" :style="getHeight()">
      <div class="box-side-bar">
        <div style="overflow: scroll;height: calc(100% + 17px);width: calc(100% + 17px)">
          <el-tree
            class="filter-tree"
            @node-click="clickNode"
            :expand-on-click-node=false
            :data="data"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </div>
      </div>
      <div :style="getOuterStyle()">
        <div v-for="i in division" :style="getBoxStyle(i)" class="videoBox">
          <video controls muted autoplay style="width:100%;height:100%;object-fit:fill"
                 :id="'live_'+i">
            Your browser is too old which doesn't support HTML5 video.
          </video>
        </div>
      </div>
      <div :style="'width: '+boxWidth+'px;height: 45px;float:left;border-bottom:1px black solid;border-right:1px black solid;'">
        <div @click="division=1" class="division-btn">1分屏<div class="division-mark" :style="'opacity:'+(division==1?1:0)+';'"></div></div>
        <div @click="division=4" class="division-btn">4分屏<div class="division-mark" :style="'opacity:'+(division==4?1:0)+';'"></div></div>
        <div @click="division=6" class="division-btn">6分屏<div class="division-mark" :style="'opacity:'+(division==6?1:0)+';'"></div></div>
        <div @click="division=8" class="division-btn">8分屏<div class="division-mark" :style="'opacity:'+(division==8?1:0)+';'"></div></div>
        <div @click="division=9" class="division-btn">9分屏<div class="division-mark" :style="'opacity:'+(division==9?1:0)+';'"></div></div>
        <div @click="division=16" class="division-btn">16分屏<div class="division-mark" :style="'opacity:'+(division==16?1:0)+';'"></div></div>
        <el-input-number v-model="pageNum" controls-position="right" @change="startPlay"
                         :min="1" :max="pageMax" size="mini" name="页码"></el-input-number>
      </div>
    </div>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import {getRoleList, add, updateById, deleteById} from '@/api/role';
import {getCameraListByAlarmId,getDeviceList,getGroupListWithDevices,getGroupList} from '@/api/device';
import {getGroupLive,stop} from '@/api/video.js'
import {getPermissionListByRoleId, add as addRP, deleteById as deleteRPById} from '@/api/rolePermission';
import {listToTree, copyProperties} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import flvjs from 'flv.js'
import {getUser} from '@/utils/auth'
import {concatAddress} from "../../utils/rtspAddress";

export default {
  name: "role",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  mounted() {
    this.data = JSON.parse(sessionStorage.getItem("alarmMsgList")) || [];
    let cnt = 0
    let _that = this
    let box = this.$refs.box
    _that.resize(box)
    this.timer = setInterval(()=>{
      cnt++
      if(cnt%3===0){
        _that.resize(box)
      }
      if(cnt%50==0){
        _that.correct()
      }
      //双击判定，时间间隔0.5s内的两次点击判定为双击
      if(_that.sgClick!=null){
        if(cnt>5) cnt=0
        if(cnt===5){
          _that.sgClick = null
        }
      }
    },100)
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val);
    },
    urlList(list){
      // console.log('here')
      if(list.length===0){
        this.pageMax = 1
      }
      else{
        this.pageMax = Math.ceil(list.length/this.division)
      }
      this.startPlay(1)
    },
    division(div){
      this.pageNum = 1 //切换分屏模式，则切换至首页
      let pageCnt = Math.ceil(this.getLen/div)
      if (pageCnt===0) pageCnt=1
      // console.log('pageCNT:'+pageCnt+';div:'+div+'\n')
      let newList = new Array(pageCnt*div).fill(null)
      for(let i=0;i<this.urlList.length&&i<newList.length;i++){
        newList[i]=this.urlList[i]
      }
      let t = setTimeout(()=>{
        this.urlList = newList
        clearTimeout(t)
      },200)
    }
  },
  data() {
    return {
      timer: null,
      boxHeight: 0,
      boxWidth: 0, //视频框的宽度，并非是box元素的宽度
      division: 4,  //分屏数量
      sgClick: null,  //单击一次的节点对象,0.5s内没有再次点击则赋值为null
      playList: new Array(16).fill(null),  //播放列表，对应的是每一个分屏的内容，一个Video标签
      urlList: new Array(4).fill(null),  //当前的url列表，项数为分屏数量的整倍数
      pageNum: 1,  //当前页
      pageMax: 1,
      data: [],
      defaultProps: {
        label: 'description'
      },
      keyword:""
    }
  },
  computed:{
    getLen(){
      let len=0
      for(let i=0;i<this.urlList.length;i++){
        if(this.urlList[i]!=null){
          len = i+1
        }
      }
      return len
    }
  },
  methods: {
    //播放i分屏的url对应的视屏
    start(i) {
      if (flvjs.isSupported()) {
        let videoElement = document.getElementById('live_'+i);
        let _that = this
        let url = _that.urlList[_that.division*(_that.pageNum-1)+i-1].url
        _that.playList[i-1] = flvjs.createPlayer({
          type: 'flv',
          url: url,
          isLive:true,
          cors:true,
          enableWorker:true,
          enableStatusBuffer: false,
          stashInitialSize: 128,
          autoCleanupSourceBuffer: true
        });
        _that.playList[i-1].attachMediaElement(videoElement);
        _that.playList[i-1].load();
        _that.playList[i-1].play();
      }
    },
    //停止播放i分屏的视频 i取1-16
    end(i) {
      if(this.playList[i-1]==null||this.playList[i-1]===undefined) return
      // console.log('end '+i)
      this.playList[i-1].unload()
      this.playList[i-1].detachMediaElement()
      try{this.playList[i-1].destroy()}
      catch (e){}
      this.playList[i-1] = null
    },
    //延时校准
    correct(){
      // for(let i=0;i<this.playList.length;i++){
      //   if(this.playList[i]!=null){
      //     this.playList[i].currentTime=this.playList[i].buffered.end(0)-0.2
      //   }
      // }
    },
    //播放组件大小自适应
    resize(box){
      // console.log(box)
      if(box.clientWidth <= 731){
        this.boxWidth = 576
        this.boxHeight = 324
      }
      else{
        this.boxWidth = parseInt((box.clientWidth-155)/192)*192
        this.boxHeight = this.boxWidth / 16 * 9
        // console.log('height:'+this.boxHeight)
        // console.log("width:"+this.boxWidth)
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //动态更改样式
    getHeight(){
      return  'height:'+(this.boxHeight+45)+'px;'
    },
    getOuterStyle(){
      return "height: "+this.boxHeight+"px;width: "+this.boxWidth+"px;float:left;background-color: #343434"
    },
    getBoxStyle(i){
      // console.log('hhh'+i)
      if(this.division===1){
        // console.log(1)
        return "height:"+100+"%;width:"+100+"%;"
      }
      else if(this.division===4){
        // console.log(4)
        return "height:"+50+"%;width:"+50+"%;"
      }
      else if(this.division===6){
        if(i===1){
          // console.log(6)
          return "height:"+(this.boxHeight/3*2)+"px;width:"+(this.boxWidth/3*2)+"px;"
        }
        else {
          // console.log(6)
          return "height:"+(this.boxHeight/3)+"px;width:"+(this.boxWidth/3)+"px;"
        }
      }
      else if(this.division===8){
        if(i===1){
          // console.log(8)
          return "height:"+75+"%;width:"+75+"%;"
        }
        else {
          // console.log(8)
          return "height:"+25+"%;width:"+25+"%;"
        }
      }
      else if(this.division===9){
        // console.log(9)
        return "height:"+(this.boxHeight/3)+"px;width:"+(this.boxWidth/3)+"px;"
      }
      else if(this.division===16){
        // console.log(16)
        return "height:"+25+"%;width:"+25+"%;"
      }
    },
    //点击节点
    clickNode(obj,node){
      if(this.sgClick === null){
        this.sgClick = node
      }
      else if(this.sgClick===node){
        let alarmId = node.data.alarmId
        let rtspList = []
        let _that = this
        getCameraListByAlarmId(alarmId).then(res=>{
          if(res.data.errorCode===200){
            res.data.data.forEach(camera=>{
              let str = concatAddress(camera)[0];
              if(str){
                rtspList.push({id:camera.id,addr:str})
              }
            })
            _that.urlList = rtspList
            // let clist = rtspList.map(e=>e.cameraId);
            // let alist = rtspList.map(e=>e.rtspAddress);

          }
        })

        let list = []
        // this.urlList = list;
      }
      return
    },
    //检索当前需要播放的url，进行正在播放中视频url的重定向等操作
    startPlay(way){
      let offset = this.pageNum-1
      let div = this.division
      let cList = [];
      let aList = [];
      for(let i=0;i<this.urlList.length;i++){
        cList.push(this.urlList[i].id)
        aList.push(this.urlList[i].addr)
      }
      let _that = this
      getGroupLive(JSON.parse(getUser()).id,cList,aList).then(res=>{
        if(res.data.errorCode==200){
          console.log(res.data)
          for(let i=0;i<res.data.data.length;i++){
            _that.urlList[i].url = res.data.data[i]
          }
          for(let i=0;i<div;i++){
            if(_that.playList[i]==null){
              console.log(i+offset*div)
              console.log(_that.urlList[1])
              if(_that.urlList[i+offset*div]==null||_that.urlList[i+offset*div].url == "") {
                console.log("No.1")
              }
              else {
                _that.start(i + 1)
                console.log("No.2")
              }
            }
            else if(_that.urlList[offset*div+i]==null||_that.urlList[i+offset*div].url == ""){
              _that.end(i+1)
              console.log("No.3")
            }
            else if(_that.urlList[offset*div+i].url!==_that.playList[i]._statisticsInfo.url||way===1){
              console.log("No.4")
              _that.end(i+1)
              _that.start(i+1)
            }
          }
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    deny(){
      return false
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style scoped>
.box{
  width: 100%;
}
.box-side-bar{
  width: 155px;
  background-color: white;
  height: 100%;
  border: 1px solid black;
  float: left;
  overflow: hidden;
}
.division-btn{
  cursor: pointer;
  height: 25px;
  margin-top: 10px;
  text-align: center;
  line-height: 25px;
  width: 60px;
  border-right: black solid 1px;
  float: left;
}
.division-mark{
  position: relative;
  top: 6px;
  left: 5px;
  height: 3px;
  width: 50px;
  background-color: #41c7db;
}
.videoBox{
  color: #cccccc;
  float: left;
  box-shadow: 0 0 1px #000000;
}
.videoBox:hover{
  box-shadow: 0 0 5px yellow;
}
/deep/ .el-tree-node:focus>.el-tree-node__content{
  background-color: #41c7db;
}
*{
  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
input{
  -webkit-user-select:auto; /*webkit浏览器*/
}
textarea{
  -webkit-user-select:auto; /*webkit浏览器*/
}
video::-webkit-media-controls-enclosure{
  display: none;
}
</style>
