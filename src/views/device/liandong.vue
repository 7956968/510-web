<!--联动设置：展示两个表，上表设备（报警），下表摄像头-->
<template>
  <div >
    <!--顶栏按钮-->
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
<!--      <el-form-item label="关键字">-->
<!--        <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getDepartmentList"></el-input>-->
<!--      </el-form-item>-->

      <el-form-item>
        <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                   @click="handleMethod(item.methodd)">{{ item.name }}
        </el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
    <tree-table :data="liandongData" :columns="liandongColumns" :options="liandongOptions" border ref="liandongTable"/>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {getUser} from '@/utils/auth';
import {addLiandong, deleteLiandongById, selectLiandong} from '@/api/device';


export default {
  name: "liandong",
  components: {
    Dialog,
    treeTable,
  },
  props: {
    device:{
      type: Object,
      default: null,
    }
  },
  data(){
    let deleteOption = (row) => {this.delete(row);}
    let isDeleteShow = (row) => {return true;}
    return {
      deviceName:null,
      liandongData: [],
      liandongColumns: [
        {
          text: '名称',
          value: 'name',
        },
        {
          text: '厂家',
          value: 'manufacturers'
        },
        {
          text: '序列号',
          value: 'serialNumber'
        },
        {
          text: 'IP',
          value: 'ip'
        },
        {
          text: '端口号',
          value: 'prot'
        },
      ],
      liandongOptions: [
        {
          text: '取消联动',
          onclick: deleteOption,
          isShow: isDeleteShow,
        }
      ],
      currentUserId:null,
      bttns:[
        {
          name:'添加',
          methodd: 'add',
          icon:'el-icon-circle-plus-outline',
          title:'添加',
        },
        //// 批量删除
      ],
      param:{},
      form:{

      }
    }
  },
  methods: {
    handleMethod(ms) {this[ms]();},
    getLiandongList(){
      if(this.device==null)return ;

      selectLiandong(this.device.id).then(res => {
        if(res.data.errorCode===200){
          this.liandongData = res.data.data;
        }else{this.$message.error("获取联动信息失败")}
      });
    },
    add(){

    },
    delete(row){
      this.$confirm('即将取消[' + row.name + ']和['+this.device.name+']的联动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saysomth(row.id).then(res => {
          if (res.data.errorCode === 200) {
            this.getLiandongList();
            this.$message.success("删除成功");
          }else{
            this.$message.error(res.data.errorMsg);
          }
        });
      }).catch(err=>{});
    },
  },
  watch: {
    device(){
      this.deviceName = this.device==null?'--':this.device.name;
      if(this.device==null){this.liandongData = [];}
      else this.getLiandongList()
    },
  },
  created() {
    this.currentUserId = JSON.parse(getUser()).id;
  },
}
</script>

<style scoped>

</style>
