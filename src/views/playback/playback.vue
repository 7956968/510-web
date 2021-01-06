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
            @node-drag-start="renewDragging"
            @node-click="clickNode"
            :draggable=true
            :allow-drag="judgeDrag"
            :expand-on-click-node=false
            :data="data"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :allow-drop="deny"
            ref="tree">
          </el-tree>
        </div>
      </div>
      <div :style="getOuterStyle()">
        <div v-for="i in 4" style="width:50%;height: 50%;" class="videoBox" @drop="changeList(i)" @dragover.prevent>
          <video controls muted autoplay style="width:100%;height:100%;object-fit:fill;pointer-events: none;"
                 :id="'live_'+i">
            Your browser is too old which doesn't support HTML5 video.
          </video>
          <div :class="i===selected?'mask_selected':'mask'" @click="select(i)">
            <div class="textBox">{{getText(i)}}</div>
          </div>
        </div>
      </div>
      <div :style="'width: '+boxWidth+'px;height: 45px;float:left;border-bottom:1px black solid;border-right:1px black solid;'">
        <div @click="Fback" class="division-btn">快退</div>
        <div @click="play" class="division-btn">播放</div>
        <div @click="pause" class="division-btn">暂停</div>
        <div @click="Fforward" class="division-btn">快进</div>
        <div @click="shutdown" class="division-btn">关闭</div>
        <el-input-number v-model="pageNum" controls-position="right" @change="startPlay"
                         :min="1" :max="pageMax" size="mini" name="页码"></el-input-number>
      </div>
    </div>
    <div :style="'width: '+(boxWidth+155)+'px;height: 110px;'">
      <div style="width: 155px;height: 100%;float: left;border: black solid 1px;border-top: none;">
        <div style="width: 100%;text-align: center;height: 50px;line-height: 50px;font-size: 16px;">视频日期</div>
        <el-date-picker
          style="width: 90%;margin-left: 5%;"
          v-model="selectedDate"
          type="date"
          size="mini"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div style="width: calc(100% - 158px);height: 100%;float: left;border-bottom:1px black solid;border-right:1px black solid;">
        <div style="width: 100%;height: 8px;"></div>
        <div v-for="i in 4" style="width: 90%;height: 21%;margin-left: 2%;box-shadow:0 0 1px black;">
          <div style="width:100px;float:left;magin-top:2%;">00:00:00</div>
          <div style="width:calc(100% - 100px);height:100%;float:left;box-shadow:0 0 1px black;cursor:pointer;"
          @mousedown="mark(i,$event)" @mouseup="unmark(i,$event)" @mousemove="renewProc(i,$event)" :id="'outer_'+i">
            <div class="proc" :id="'proc_'+i"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import treeTable from '@/components/TreeTable';
// import {getRoleList, add, updateById, deleteById} from '@/api/role';
// import {getPermissionListByRoleId, add as addRP, deleteById as deleteRPById} from '@/api/rolePermission';
// import {listToTree, copyProperties} from '@/utils';
// import Dialog from '@/components/dialog/index';
// import selectTree from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import flvjs from 'flv.js'
// import {getUser} from '@/utils/auth'

export default {
  name: "playback",
  // components: {
  //   Dialog,
  //   treeTable,
  //   selectTree
  // },
  mounted() {
    let cnt = 0
    let time = 0
    let _that = this
    let box = this.$refs.box
    _that.resize(box)
    this.timer = setInterval(()=>{
      cnt++
      time++;
      if(cnt%3===0){
        _that.resize(box)
      }
      //双击判定，时间间隔0.5s内的两次点击判定为双击
      if(_that.sgClick!=null){
        if(cnt>5) cnt=0
        if(cnt===5){
          _that.sgClick = null
        }
      }
      if(time>=10) {
        time=0;
        for(let i=0;i<4;i++){
          if(this.speed[i]!==1&&this.speed[i]!==0){
            document.getElementById('live_'+(i+1)).currentTime += this.speed[i]
          }
        }
      }
    },100)
    window.addEventListener("mouseup", ()=>{
      // console.log('all')
      _that.dragging_proc = 0
    })
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
    }
  },
  data() {
    return {
      speed: new Array(4).fill(0), //控制快进快退,为1时正常播放，为0时暂停
      selected: 0, //表示选中的视频，0表示未选中
      selectedDate: '',
      timer: null,
      boxHeight: 0,
      boxWidth: 0, //视频框的宽度，并非是box元素的宽度
      division: 4,  //分屏数量
      current_time: new Array(4).fill(0),
      duration: new Array(4),
      dragging: {}, //拖拽中的数据
      sgClick: null,  //单击一次的节点对象,0.5s内没有再次点击则赋值为null
      playList: new Array(4).fill(null),  //播放列表，对应的是每一个分屏的内容，一个Video标签
      urlList: new Array(4).fill(null),  //当前的url列表，项数为分屏数量的整倍数
      pageNum: 1,  //当前页
      pageMax: 1,
      dragging_proc: 0,//标记拖动中的进度条，0位未拖拽任何进度条
      data: [{
        label: '分组 1',
        children: [{
          label: '子分组 1-1',
          children: [{
            label: '视频1',
            url: '/1.mp4'
          }, {
            label: '视频2',
            url: '/2.mp4'
          },{
            label: '视频3',
            url: '/3.mp4'
          }, {
            label: '视频4',
            url: '/4.mp4'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1'
        }, {
          label: '二级 2-2'
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1'
        }, {
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
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
    },
    getText(){
      return function (i){
        if(this.speed[i-1]===0) return "暂停"
        if(this.speed[i-1]===1) return ""
        if(this.speed[i-1]>1) return "快进：✖"+this.speed[i-1]
        if(this.speed[i-1]<0) return "快退：✖"+(-this.speed[i-1])
      }
    }
  },
  methods: {
    select(i){
      this.selected=i;
    },
    setSelected(){
      let tmp = this.selected
      this.selected = 5
      this.selected = tmp
    },
    //播放i分屏的url对应的视屏
    start(i) {
      if (flvjs.isSupported()) {
        let videoElement = document.getElementById('live_'+i);
        let _that = this
        // console.log(this.urlList)
        // console.log('dividion:'+_that.division)
        // console.log('pageNum:'+_that.pageNum)
        // console.log(_that.division*(_that.pageNum-1)+i-1)
        let url = _that.urlList[_that.division*(_that.pageNum-1)+i-1].url
        _that.playList[i-1] = flvjs.createPlayer({
          type: 'mp4',
          url: url,
          cors:true,
          enableWorker:true,
          enableStatusBuffer: false,
          stashInitialSize: 128,
          autoCleanupSourceBuffer: true
        });
        _that.playList[i-1].attachMediaElement(videoElement);
        _that.playList[i-1].load();
        setTimeout(()=>{
          _that.duration[i-1] = videoElement.duration
        }, 1500)
        _that.playList[i-1].play();
        _that.speed[i-1] = 1;
        _that.setSelected();
        _that.listen(i)
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
    //是否可拖拽节点，只有具体的摄像头可以直接拖拽播放
    judgeDrag(node){
      return node.level===3
    },
    renewDragging(node){
      this.dragging = {name:node.data.label,url:node.data.url}
    },
    //点击节点
    clickNode(obj,node){
      if(this.sgClick === null){
        this.sgClick = node
      }
      else if(this.sgClick===node){
        let list = []
        switch (node.level){
          case 1:{
            for (let i=0;i<node.data.children.length;i++){
              for (let j=0;j<node.data.children[i].children.length;j++){
                list.push({name:node.data.children[i].children[j].label,url:node.data.children[i].children[j].url})
              }
            }
            break
          }
          case 2:{
            for (let i=0;i<node.data.children.length;i++){
              list.push({name:node.data.children[i].label,url:node.data.children[i].url})
            }
            break
          }
          case 3:{
            list.push({name:node.data.label,url:node.data.url})
            break
          }
        }
        this.urlList = list
      }
      return
    },
    //检索当前需要播放的url，进行正在播放中视频url的重定向等操作
    startPlay(way){
      let offset = this.pageNum-1
      let div = this.division
      for(let i=0;i<div;i++){
        if(this.playList[i]==null){
          if(this.urlList[i+offset*div]==null) {}
          else {
            this.start(i + 1)
          }
        }
        else if(this.urlList[offset*div+i]==null){
          this.end(i+1)
        }
        else if(this.urlList[offset*div+i].url!==this.playList[i]._mediaDataSource.url||way===1){
          this.end(i+1)
          this.start(i+1)
        }
        else{
          console.log(this.playList[i]._mediaDataSource.url)
        }
      }
    },
    //拖拽改变urlList,根据设计，拖拽不会增加列表中的项，只会更改值
    changeList(i){
      // console.log(this.division*(this.pageNum-1)+i-1)
      // console.log(this.dragging)
      this.urlList[this.division*(this.pageNum-1)+i-1] = this.dragging
      this.dragging = {}
      this.startPlay(0)
    },
    deny(){
      return false
    },
    mark(i,ev){
      let event = event||ev
      this.dragging_proc = i+1
      document.getElementById('proc_'+i).style="width:"+event.offsetX+"px;"
    },
    renewProc(i,ev){
      let event = event||ev
      if(i+1==this.dragging_proc){
        // console.log('nice')
        document.getElementById('proc_'+i).style="width:"+event.offsetX+"px;"
      }
    },
    unmark(i,ev){
      let event = event||ev
      if(this.dragging_proc == i+1){
        document.getElementById('live_'+i).currentTime = 
        event.offsetX/document.getElementById('outer_'+i).clientWidth*document.getElementById('live_'+i).duration
      }
      // console.log(this.dragging_proc+'unmark')
    },
    listen(index){
      let _that = this
      let video = document.getElementById('live_'+index)
      let proc = document.getElementById('proc_'+index)
      video.addEventListener("timeupdate",()=>{
        if(video===undefined) return;
        _that.current_time[index-1] = video.currentTime;
        let len = video.currentTime/video.duration
        if(proc!==undefined&&_that.dragging_proc===0){
          proc.style='width:'+(len*100)+'%;'
        }
      // if(_that.$refs.video.duration!=undefined&&!isNaN(_that.$refs.video.duration)){
      //   _that.writeTime = parseInt(_that.$refs.video.currentTime/60)+':'+parseInt(_that.$refs.video.currentTime%60)+' / '+parseInt(_that.$refs.video.duration/60)+':'+parseInt(_that.$refs.video.duration%60)
      // }
      },false)
    },
    Fback(){
      if(this.selected===0){
        console.log('未选中视频！')
        return
      }
      let index = this.selected-1
      if(this.speed[index]<0&&this.speed[index]>-32){
        this.speed[index]*=2;
      }
      else if(this.speed[index]===1){
        console.log('ok')
        document.getElementById('live_'+this.selected).pause()
        this.speed[index]=-2;
      }
      else{
        this.speed[index]=-2;
      }
      this.setSelected()
    },
    Fforward(){
      if(this.selected===0){
        console.log('未选中视频！')
        return
      }
      let index = this.selected-1
      if(this.speed[index]>1&&this.speed[index]<32){
        this.speed[index]*=2;
      }
      else if(this.speed[index]===1){
        document.getElementById('live_'+this.selected).pause()
        this.speed[index]=2;
      }
      else{
        this.speed[index]=2;
      }
      this.setSelected()
    },
    play(){
      if(this.selected===0){
        console.log('未选中视频！')
        return
      }
      let index = this.selected-1
      this.speed[index] = 1
      document.getElementById('live_'+this.selected).play()
      this.setSelected()
    },
    pause(){
      if(this.selected===0){
        console.log('未选中视频！')
        return
      }
      let index = this.selected-1
      this.speed[index] = 0
      document.getElementById('live_'+this.selected).pause()
      this.setSelected()
    },
    shutdown(){
      if(this.selected===0){
        console.log('未选中视频！')
        return
      }
      let index = this.selected-1
      this.speed[index] = 0
      document.getElementById('live_'+this.selected).src='';
      this.playList[index]._mediaDataSource.url=null
      document.getElementById('live_'+this.selected).load()
      let offset = this.pageNum-1
      let div = this.division
      this.urlList[div*offset+index]=null
      this.setSelected()
      console.log(this.urlList)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
    window.removeEventListener("mouseup", ()=>{})
  }
};
</script>

<style scoped>
.box{
  width: 100%;
}
.box-side-bar{
  width: 155px;
  background-color: white;
  height: calc(100% - 1px);
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
.videoBox{
  color: #cccccc;
  float: left;
  box-shadow: 0 0 1px #000000;
}
.videoBox:hover{
  box-shadow: 0 0 5px yellow;
}
.proc{
  float:left;
  height:100%;
  border-right:#41c7db 5px solid;
  background-color:#e1f7fb;
  pointer-events: none;
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
.mask{
  float:left;
  height: 100%;
  width: 100%;
  position: relative;
  bottom: 102%;
}
.mask_selected{
  float:left;
  box-shadow:rgb(11, 234, 235) 0px 0px 18px inset;
  height: 100%;
  width: 100%;
  position: relative;
  bottom: 102%;
}
.textBox{
  float: right;
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
  pointer-events: none;
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
