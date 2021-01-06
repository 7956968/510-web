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
        <div :style="'height:'+height+'px;width:'+width+'px;box-shadow:0 0 3px black;position:absolute;'" 
        @mousedown="start($event)" @mouseup="merge($event)" ref="innerBox">
          <div v-for="(item,i) in division" :ref="'box'+i" :style="'height:'+item.height+'px;width:'+item.width+'px;top:'+
          item.top+'px;left:'+item.left+'px;position:absolute;box-shadow:0 0 3px '+(selected==i?'#41c7db':'black')+'; '" @click="select(i)"></div>
        </div>
      </div>
      <div :style="'width: '+boxWidth+'px;height: 45px;float:left;border-bottom:1px black solid;border-right:1px black solid;'">
        <div class="division-btn">创建</div>
        <div class="division-btn">打开</div>
        <div class="division-btn">保存</div>
        <div class="division-btn" @click="divide">分割</div>
        <div class="division-btn">队列</div>
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
  name: "rectangle",
  // components: {
  //   Dialog,
  //   treeTable,
  //   selectTree
  // },
  mounted() {
    this.division = [{top:0,left:0,height:this.height,width:this.width,list:[]}]
    let cnt = 0
    let _that = this
    let box = this.$refs.box
    _that.resize(box)
    this.timer = setInterval(()=>{
      cnt++
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
    },100)
    window.addEventListener("mouseup", ()=>{
      // console.log('all')
      _that.dragging_proc = 0
      _that.chooseArea = false
    })
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val);
    },
    chooseArea(val){
      if(!val){
        this.x1=this.x2=this.y1=this.y2=0//未选中区域则选中点坐标进行初始化
      }
    }
  },
  data() {
    return {
      timer: null,
      selected: -1,
      chooseArea: false,
      boxHeight: 0,
      boxWidth: 0, //视频框的宽度，并非是box元素的宽度
      x1:0,
      y1:0,
      x2:0,
      y2:0,//分别表示选中初始点和终止点的横坐标和纵坐标
      division: [], //储存当前的矩阵方案
      dragging: {}, //拖拽中的数据
      sgClick: null,  //单击一次的节点对象,0.5s内没有再次点击则赋值为null
      dragging_proc: 0,//标记拖动中的进度条，0为未拖拽任何进度条
      height:540,
      width:960,
      row:3,//分割行数
      column:3,//分割列数
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
    getOffsetTop(){  //计算预览屏幕相对于全部可视区域的横竖位移
      let innerBox = this.$refs['innerBox']
      let tmp = innerBox.offsetTop
      let val = innerBox.offsetParrent
      while(val!=null){
        tmp += val.offsetTop
        val = val.offsetParrent
      }
      return tmp
    },
    getOffsetLeft(){
      let innerBox = this.$refs['innerBox']
      let tmp = innerBox.offsetLeft
      let val = innerBox.offsetParrent
      while(val!=null){
        tmp += val.offsetLeft
        val = val.offsetParrent
      }
      return tmp
    }
  },
  methods: {
    select(i){
      this.selected=(i==this.selected?-1:i);
    },
    setSelected(){
      let tmp = this.selected
      this.selected = 5
      this.selected = tmp
    },
    //组件大小自适应
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
      return "height: "+this.boxHeight+"px;width: "+this.boxWidth+"px;float:left;border:1px solid black;border-left:none;"
    },
    //是否可拖拽节点，只有具体的摄像头可以直接拖拽播放
    judgeDrag(node){
      return node.level===3
    },
    renewDragging(node){
      this.dragging = {name:node.data.label,url:node.data.url}
    },
    deny(){return false},
    divide(){
      if(this.selected==-1) {
        console.log('您还未选中任何矩阵！')
        return
      }
      let height = this.division[this.selected].height
      let width = this.division[this.selected].width
      let baseX = this.division[this.selected].left
      let baseY = this.division[this.selected].top
      let row = this.row
      let column = this.column
      let nh = parseInt(height/row)
      let nw = parseInt(width/column)
      let rh = height%row //为了方便判断合并操作的合法性，需要在分割的时候将大矩形分割为紧密堆叠的小矩形
      let rw = width%column
      let result = []
      for(let i=0;i<row*column;i++){
        let item = {top:0,left:0,height:0,width:0,list:[]}
        let x = i%column
        let y = parseInt(i/column)
        item.width=x<rw?nw+1:nw
        item.height=y<rh?nh+1:nh
        item.top=(y<rh?y*nh+y+baseY:y*nh+baseY+rh)
        item.left=(x<rw?x*nw+x+baseX:x*nw+baseX+rw)
        if(item.width!=0&&item.height!=0) result.push(item)
      }
      this.division.splice(this.selected,1)
      this.division.push(...result)
      this.selected=-1
    },
    start(ev){
      this.chooseArea=true
      let event = event||ev
      this.x1 = event.clientX - this.getOffsetLeft
      this.y1 = event.clientY - this.getOffsetTop
    },
    merge(ev){
      if(!this.chooseArea) return
      let event = event||ev
      this.x2 = event.clientX - this.getOffsetLeft
      this.y2 = event.clientY - this.getOffsetTop
      let selectedRecs = [] //表示所有被选中的矩形，只要x1,x2,y1,y2确定的四个点中有一个存在于某矩形中，则该矩形push到其中
      let merged = {top:0,left:0,height:0,width:0,list:[]} //最终合并出的大矩形
      let height1 = 0 //x1穿过的所有矩形的高度之和
      let height2 = 0 //x2穿过的所有矩形的高度之和
      let width1 = 0 //y1穿过的所有矩形的宽度之和
      let width2 = 0 //y2穿过的所有矩形的宽度之和
      let minx = 9999999 //选中区域的最左端
      let maxx = 0 //选中区域的最右端
      let miny = 9999999 //选中区域的最上端
      let maxy = 0 //选中区域的最下端
      let s = 0 //选中区域的总面积
      //要满足选中区域为矩形，则必须满足两height相等且等于maxy-miny、两width相等且等于maxx-minx
      for(let i=0;i<this.division.length;i++){
        let item = this.division[i]
        if(this.isInner(item.left,item.top,item.width,item.height)){
          selectedRecs.push(item)
          s += item.height*item.width
          if(item.left<=this.x1&&this.x1<=item.left+item.width) height1+=item.height
          if(item.left<=this.x2&&this.x2<=item.left+item.width) height2+=item.height
          if(item.top<=this.y1&&this.y1<=item.top+item.height) width1+=item.width
          if(item.top<=this.y2&&this.y2<=item.top+item.height) width2+=item.width
          minx = minx<item.left?minx:item.left
          miny = miny<item.top?miny:item.top
          maxx = maxx>item.left+item.width?maxx:item.left+item.width
          maxy = maxy>item.top+item.height?maxy:item.top+item.height
        }
      }
      if(height1==height2&&width1==width2&&height1==maxy-miny&&width1==maxx-minx&&s==height1*width1){
        let result = [] //最终的新矩阵队列
        let len = this.division.length
        while(len>0){
          len--
          if(selectedRecs.indexOf(this.division[len])<0){
            result.push(this.division[len])
          }
        }
        result.push({top:miny,left:minx,height:height1,width:width1,list:[]})
        this.division = result
      }
      else if(s!=0){
        console.log('选中区域不合法，选中区域必须为矩形！')
      }
      this.chooseArea=false
    },
    isInner(offsetX,offsetY,width,height){
      let x1 = this.x1<this.x2?this.x1:this.x2
      let x2 = this.x1>=this.x2?this.x1:this.x2
      let y1 = this.y1<this.y2?this.y1:this.y2
      let y2 = this.y1>=this.y2?this.y1:this.y2
      if(x1>offsetX&&x2<offsetX+width&&y1>offsetY&&y2<offsetY+height) return false
      // console.log(x1+','+x2)
      // console.log(y1+','+y2)
      // console.log(offsetX+','+(offsetX+width))
      // console.log(offsetY+','+(offsetY+height))
      return !(x1>offsetX+width||x2<offsetX||y1>offsetY+height||y2<offsetY)
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
</style>
