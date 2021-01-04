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

    <!--对话框-->
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
        <el-form-item label="分组">
          <selectTree
            style="width: 79%"
            placeholder="选择分组"
            :options="groupList"
            v-model="currentGroupId"
            clearable
            accordion="true"
            :defaultExpandLevel=4
            :normalizer="normalizer"
          />
        </el-form-item>
        <el-form-item label="摄像头" prop="deviceIdList">
          <el-select v-model="form.deviceIdList"
                     placeholder="选择摄像头(可多选)"
                     multiple
          >
            <el-option
              v-for="item in cameraList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {getUser} from '@/utils/auth';
import {getDeviceList,
  addAllLiandong, deleteLiandongById, deleteAllLiandongByIdList, selectLiandong} from '@/api/device';
import {listToTree, copyProperties, normalizer} from '@/utils';
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  name: "liandong",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  props: {
    device:{
      type: Object,
      default: null,
    },
    groupList:{
      type: Array,
    }
  },
  data(){
    let deleteOption = (row) => {this.delete(row);}
    let isDeleteShow = (row) => {return true;}
    let validateDevIdList = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择摄像头'));
      } else {
        callback();
      }
    };
    return {
      formVisible: false,
      dialogName: '添加_报警-摄像头_联动',
      deviceName:null,
      currentUserId:null,
      currentGroupId: null, // 对话框-选择分组-分组id
      cameraList: [],   // 为添加联动提供选项
      liandongData: [], // 表格数据
      liandongColumns: [ // 列字段
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
      liandongOptions: [ // 操作列选项
        {
          text: '取消联动',
          onclick: deleteOption,
          isShow: isDeleteShow,
        }
      ],
      bttns:[ // 操作按钮
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
        deviceIdList: [],
        createUser: null,
        updateUser: null,
      },
      formRules:{
        deviceIdList:[{validator: validateDevIdList, required: true, trigger: 'blur'}],
      },
    }
  },
  methods: {
    normalizer(node) {return normalizer(node)},
    handleMethod(ms) {this[ms]();},
    getLiandongList(){
      if(this.device==null)return ;

      selectLiandong(this.device.id).then(res => {
        if(res.data.errorCode===200){
          this.liandongData = res.data.data;
        }else{this.$message.error(res.data.errorMsg)}
      }).catch(err => {console.log(err)});
    },
    // 更新表单的摄像头选项
    getCameraList(){
      getDeviceList({groupId:this.currentGroupId,type:'摄像头'})
        .then(res => {
            if(res.data.errorCode===200){
              this.cameraList = res.data.data;
            }else{
              console.log(res.data.errorMsg)
            }
          })
        .catch(err=>{console.log(err)});
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
      let cameraIdList = this.$refs.liandongTable.getSelectedKeys();
      // 判空

      // 调用接口
      deleteAllLiandongByIdList(cameraIdList).then(res => {
        if(res.data.errorCode === 200){
          this.$message.success("删除成功")
          this.getLiandongList()
        }else{
          this.$message.error(res.data.errorMsg)
        }
      }).catch( err => {console.log(err)})
    },
  },
  watch: {
    device(){
      this.deviceName = this.device==null?'--':this.device.name;
      if(this.device==null){this.liandongData = [];}
      else this.getLiandongList()
    },
    currentGroupId(){
      // 在分组选定/更改后, 更新选项
      this.getCameraList();
    },
  },
  created() {
    this.currentUserId = JSON.parse(getUser()).id;
  },
}
</script>

<style scoped>

</style>
