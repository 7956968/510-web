<!--联动设置：展示两个表，上表设备（报警），下表摄像头-->
<template>
  <div >
    <!--顶栏按钮-->
    <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
<!--      <el-form-item label="关键字">-->
<!--        <el-input v-model.trim="param.keyword" placeholder="请输入关键字" maxlength="255" clearable @blur="getDepartmentList"></el-input>-->
<!--      </el-form-item>-->

      <el-form-item>
        <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                   @click="handleMethod(item.methodd)">{{ item.name }}
        </el-button>
      </el-form-item>
    </el-form>

    <!--表格-->
    <tree-table :data="linkageData"
                :columns="linkageColumns"
                :options="linkageOptions"
                border
                ref="linkageTable"
                not-tree
    />

    <!--对话框-->
    <el-dialog :title="dialogName"
               :visible.sync="formVisible"
               @close=""
               center
               :close-on-click-modal="false"
    >
      <el-form :model="form" size="mini" label-position="left" label-width="100px"
               ref="linkageForm"
               :rules="formRules">
        <el-form-item label="报警设备">
          <el-input v-model.trim="deviceName" :disabled="true" style="width: auto"/>
        </el-form-item>
        <el-form-item label="分组">
          <selectTree
            style="width: 40%"
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
                     style="width: 60%"
          >
            <el-option
              v-for="item in cameraList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="formVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
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
  addAllLinkage, deleteLinkage, deleteAllLinkageByIdList, selectLinkage} from '@/api/device';
import {listToTree, copyProperties, normalizer} from '@/utils';
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  name: "linkage",
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
      dialogName: '添加"报警器-摄像头"联动',
      deviceName:null,
      currentUserId:null,
      currentGroupId: null, // 对话框-选择分组-分组id
      cameraList: [],   // 为添加联动提供选项
      linkageData: [], // 表格数据
      linkageColumns: [ // 列字段
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
      linkageOptions: [ // 操作列选项
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
        {
          name:'刷新',
          methodd: 'getLinkageList',
          icon:'el-icon-refresh',
          title:'刷新',
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
    normalizer,
    handleMethod(ms) {this[ms]();},
    getLinkageList(){
      if(this.device==null)return ;

      selectLinkage(this.device.id).then(res => {
        if(res.data.errorCode===200){
          this.linkageData = res.data.data;
          // this.$message.success("获取联动信息成功")
        }else{this.$message.error(res.data.errorMsg)}
      }).catch(err => {console.log(err)});
    },
    // 更新表单的摄像头选项
    getCameraList(){
      getDeviceList({groupId:this.currentGroupId,type:'camera'})
        .then(res => {
            if(res.data.errorCode===200){
              this.cameraList = res.data.data;
              // 已经联动的摄像头idArray
              let cameraIdList = this.linkageData.map(e=>e.id);
              this.cameraList.forEach(item=>{
                if(cameraIdList.indexOf(item.id)>-1){// 设置禁用
                  item.disabled = true;
                }
              })
            }else{
              console.log(res.data.errorMsg)
            }
          })
        .catch(err=>{});
    },
    add(){
      if(this.device==null){
        this.$message.warning('未选中设备，左键点击以选择')
        return ;
      }
      // 清空表单
      this.form.alarmId = this.device.id;
      this.form.createUser = this.form.updateUser = this.currentUserId;
      this.form.deviceIdList = [];
      this.currentGroupId = null;
      this.formVisible=true;
      // this.dialogName='添加"报警-摄像头"联动';
    },
    submitForm(){
      this.$refs.linkageForm.validate(valid => {
        if(!valid) return ;
        // 调用接口, 批量添加
        addAllLinkage(this.form).then(res => {
          if(res.data.errorCode === 200) {
            this.$message.success("添加成功");
            this.getLinkageList();
            this.formVisible = false;
          }else {
            this.$message.error(res.data.errorMsg);
          }
        }).catch(err =>{})
      })
    },
    delete(row){
      this.$confirm('即将取消[' + row.name + ']和['+this.device.name+']的联动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteLinkage({deviceId:row.id,alarmId:this.device.id});
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.$message.success("取消联动成功");
          this.getLinkageList();
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{});
    },
    deleteAll(){
      let checkedIdList = this.$refs.linkageTable.getSelectedKeys();
      // 判空
      if( ! checkedIdList.length ){
        this.$message.warning("未勾选数据");
        return ;
      }
      let checkedRowList = this.$refs.linkageTable.getSelectedRows(); // 被勾选的列数组
      let deletedNameList = checkedRowList.map(e=>e.name);  // 待删除列的名字列表
      this.$confirm('即将取消"'+this.device.name+'"与[' + deletedNameList + ']联动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口
        return deleteAllLinkageByIdList(checkedIdList)
      }).then(res => {
        if(res.data.errorCode === 200){
          this.$message.success("删除成功")
          this.getLinkageList()
        }else{
          this.$message.error(res.data.errorMsg)
        }
      }).catch( err => {console.log(err)})
    },
  },
  watch: {
    device(){
      this.deviceName = this.device==null?'--':this.device.name;
      if(this.device==null){this.linkageData = [];}
      else this.getLinkageList()
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
