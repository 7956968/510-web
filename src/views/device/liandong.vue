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

    <el-dialog :title="dialogName"
               :visible.sync="formVisible"
               @close=""
               center
    >
      <el-form :model="form" size="mini" label-position="left" label-width="100px"
               ref="liandongForm"
               :rules="formRules">
        <el-form-item label="报警设备">
          <el-input v-model="deviceName" :disabled="true" style="width: auto"/>
        </el-form-item>
        <el-form-item label="摄像头">
          <el-input>待添加</el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {getUser} from '@/utils/auth';
import {addAllLiandong, deleteLiandongById, selectLiandong} from '@/api/device';


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
      formVisible: false,
      dialogName: '添加_报警-摄像头_联动',
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
        alarmId: null,
        deviceId: null,
        createUser: null,
        updateUser: null,
      },
      formRules:{
        deviceIdList:[{required: true, trigger: 'blur', message: "请选择摄像头"}],
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
        }else{this.$message.error(res.data.errorMsg)}
      }).catch(err => {console.log(err)});
    },
    add(){
      if(this.device==null){
        this.$message.warning('未选中设备')
        return ;
      }
      this.form.alarmId = this.device.id;
      this.form.createUser = this.form.updateUser = this.currentUserId;
      this.formVisible=true;
      // this.dialogName="添加_报警-摄像头_联动";
    },
    submitForm(){
      this.$refs.liandongForm.validate(valid => {
        if(!valid) return ;
        // 调用接口, 批量添加
        addAllLiandong(this.form).then(res => {
          if(res.data.errorCode === 200) {
            this.$message.success("添加成功");
            this.getLiandongList();
          }else {
            this.$message.error(res.data.errorMsg);
          }
        }).catch(err =>{console.log(err)})
      })
    },
    delete(row){
      this.$confirm('即将取消[' + row.name + ']和['+this.device.name+']的联动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLiandongById(row.id).then(res => {
          if (res.data.errorCode === 200) {
            this.getLiandongList();
            this.$message.success("删除成功");
          }else{
            this.$message.error(res.data.errorMsg);
          }
        });
      }).catch(err=>{console.log(err)});
    },
    deleteAll(){
      console.log("in deleteAll")
      // 获取勾选
      // 判空
      // 删除all
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
