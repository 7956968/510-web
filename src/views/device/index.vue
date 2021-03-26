<template>
  <div class="content_container">
    <el-container>
      <!-- 顶栏按钮 -->
      <el-header>
        <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
          <el-form-item label="关键字">
            <!-- 失去焦点触发可以添加属性@blur="getDeviceList"-->
            <el-input v-model.trim="param.keyword" placeholder="请输入关键字" maxlength="255" clearable/>
          </el-form-item>
          <el-form-item label="设备类型" prop="">
            <!-- 失去焦点触发可以添加属性@blur="getDeviceList"-->
            <el-select v-model.trim="param.type"
                       placeholder="请选择设备类型"
                       clearable
            >
              <el-option
                v-for="(item,idx) in deviceTypeOptions"
                :key="item.index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                       v-if="!item.invisible"
                       @click="handleMethod(item.methodd)">{{ item.name }}
            </el-button>
            <!--          <el-button @click="uploadExcelVisible=true" style="font-size: 18px">-->
            <!--            上传设备数据-->
            <!--          </el-button>-->
          </el-form-item>
        </el-form>
      </el-header>

      <!-- 侧边分组，表格 -->
      <el-container>
        <!-- 侧边分组 -->
        <el-aside width="200px" style="height: 650px; border: 1px solid #000000">
          <el-row style="margin-top:10px;margin-bottom:10px;text-align:center">
            <el-button @click="groupFormVisible=true"
                       style="background:#e3e4f5;"
                       icon="el-icon-setting"
                       size="middle"
            >分组设置
            </el-button>
          </el-row>
          <div
            style="margin-top:10px;margin-bottom:10px;background:#97b5e7;height:30px;text-align:center;line-height: 30px">
            分组列表
          </div>
          <!-- 用于展示的分组列表 -->
          <!-- 默认分组独自一个eltree -->
          <el-tree :data="defaultGroup"
                   @node-click="handleGroupNodeClick"
                   highlight-current
                   ref="defaultGroupTree"
          />
          <!-- 自定义的分组 -->
          <el-tree :data="groupList"
                   :props="defaultProps"
                   @node-click="handleGroupNodeClick"
                   highlight-current
                   empty-text="当前无自定义分组，请创建"
                   default-expand-all
                   :expand-on-click-node="false"
                   ref="groupTreeShow"
          />
        </el-aside>
        <!-- 表格-->
        <el-main>
          <div>
            <span style="color:#5b47c9">当前所在组: </span>{{ curGroupName }}
          </div>
          <tree-table :data="data"
                      :columns="columns"
                      :options="tableOption"
                      border
                      ref="curTable"
                      :handle-row-click="handleRowClick"
                      highlight-current-row
                      not-tree
          />
          <!-- 页码  -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size.sync="pageSize"
            :total="total"
            :current-page="currentPage"
            @current-change="changePage"
            @prev-click="changePage"
            @next-click="changePage"
          />
          <!--与设备表格保持距离-->
          <div style="margin-top:40px;">
            <span style="color:#5b47c9">当前选中设备: </span>{{ curDeviceName || '--' }}
          </div>
          <!--表格[通道, 联动摄像头]-->
          <el-tabs type="border-card">
            <el-tab-pane label="通道">
              <channel :device="curDevice"></channel>
            </el-tab-pane>
            <el-tab-pane label="联动摄像头">
              <linkage :device="curDevice"
                       :group-list="groupList"
              />
            </el-tab-pane>
          </el-tabs>

        </el-main>
      </el-container>
    </el-container>
    <!--add/modify 设备表单-->
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center :close-on-click-modal="false">
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="厂家" prop="manufacturers">
          <el-select
            placeholder="请选择厂家"
            v-model.trim="form.manufacturers"
            filterable
            allow-create
            @change.native="selectManufacturersBlur"
            @blur.native="selectManufacturersBlur"
            style="width: 79%">
            <el-option
              v-for="(item,idx) in manufacturersOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="名称" maxlength="30" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select
            placeholder="请选择"
            v-model="form.type"
            filterable
            allow-create
            @change.native="selectDeviceTypeBlur"
            @blur.native="selectDeviceTypeBlur"
            style="width: 79%">
            <el-option
              v-for="(item,idx) in deviceTypeOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model.trim="form.serialNumber" placeholder="序列号" maxlength="30" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" maxlength="30" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model.trim="form.loginName" placeholder="请输入用户名" maxlength="10" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码" maxlength="20" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="prot">
          <el-input v-model.trim="form.prot" placeholder="请输入端口号" maxlength="10" style="width: auto"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  分组设置  -->
    <el-dialog title="分组设置"
               :visible.sync="groupFormVisible"
               @close=""
               center
               :close-on-click-modal="false"
    >
      <div style="height: 500px;">
        <el-alert
          title=""
          type="info"
          center
        >
          点击右侧<i class="el-icon-edit"></i>对分组修改
        </el-alert>
        <span>
          <!--用于修改的分组列表-->
          <el-tree :data="groupList"
                   :props="defaultProps"
                   show-checkbox
                   default-expand-all
                   ref="groupTree"
                   node-key="id"
                   empty-text="当前无分组"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  size="mini"
                  type="primary"
                  @click="modifyGroup(data)"
                  icon="el-icon-edit"
                  circle
                >
                </el-button>
              </span>
            </span>
          </el-tree>
        </span>

      </div>
      <!--内层对话框-->
      <el-dialog
        width="30%"
        :title="innerDialogTitle"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
      >
        <el-form :model="groupForm" ref="GroupForm" :rules="groupFormRules" :label-position="labelPosition"
                 label-width="100px"
                 size="mini">
          <el-form-item label="分组名" prop="name">
            <el-input v-model.trim="groupForm.name" placeholder="请输入组名" maxlength="30"/>
          </el-form-item>
          <el-form-item label="父分组" prop="pid">
            <selectTree
              style="width: 79%"
              placeholder="请选择父分组"
              ref="selectTreeGroup"
              :options="groupList"
              v-model="groupForm.pid"
              clearable
              accordion="true"
              :defaultExpandLevel=3
              :normalizer="normalizer"
            />
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="innerVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitGroupForm">提 交</el-button>
        </div>
      </el-dialog>
      <div>
        <el-button @click="groupFormVisible = false">关闭窗口</el-button>
        <el-button type="primary" @click="addGroup">添加分组</el-button>
        <el-button type="danger" @click="deleteGroups">删除已勾选分组</el-button>
      </div>
    </el-dialog>

    <!-- 分配设备分组的弹窗 -->
    <el-dialog title="分配分组"
               :visible.sync="distributeDialogVisible"
               @close=""
               center
               :close-on-click-modal="false"
    >
      <el-alert title="请注意"
                type="info"
      >
        <br/>
        1. 每个设备可以存在于多个分组中<br/>
        2. 若不选择分组，设备将被添加至'默认分组'
      </el-alert>

      <el-row style="margin: 15px 0;text-align:center;font-size: 22px">将设备{{ checkedDeviceNameList }}</el-row>
      <el-row style="margin: 15px 0;text-align:center;font-size: 22px;color:#1ca6f5">添加至</el-row>
      <div style="text-align:center">
        <!-- 用于分配的分组列表 -->
        <el-tree :data="groupList"
                 :props="defaultProps"
                 show-checkbox
                 default-expand-all
                 ref="distributeTree"
                 node-key="id"
                 empty-text="当前无分组"
                 check-strictly
        >
        </el-tree>

      </div>
      <div style="margin: 15px 0;text-align:center">
        <el-button @click="distributeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributeDevicesToGroups">确 认</el-button>
      </div>
    </el-dialog>

    <!--    上传excel文件-->
    <!--    <el-dialog title="上传设备数据"-->
    <!--               :visible="uploadExcelVisible"-->
    <!--               @close="uploadExcelVisible=false"-->
    <!--               center-->
    <!--               :close-on-click-modal="false"-->
    <!--    >-->
    <!--      <upload-excel :beforeUpload="beforeUpload"-->
    <!--                    :onSuccess="onSuccess"-->
    <!--                    ref="uploadExcel"-->
    <!--      />-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {listToTree, copyProperties, setEachPid, setNotLeafDisabled, normalizer} from '@/utils';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'
import {getDeviceList, add, updateById, deleteById, deleteAll, countByGroupId,
  getGroupList, getGroupListByDeviceId, addGroup, updateGroupById, deleteAllGroups,
  distributeDevicesToGroups} from '@/api/device';
import channel from "./channel";
import linkage from "./linkage";
import UploadExcel from "@/components/UploadExcel";
//// 右键菜单组件
// import VueContextMenu from "vue-contextmenu"


export default {
  name: "index",
  components: {
    channel,
    linkage,
    Dialog,
    treeTable,
    selectTree,
    UploadExcel,
    // VueContextMenu,
  },
  data() {
    let updateOpen = (row) => {
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.form.updateUser = this.currentUserId;
      this.form.createUser = null;
      this.dialogName = "修改设备配置";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    }
    let deleteOption = (row) => {
      this.delete(row);
    }
    let isUpdateShow = (row) => {
      return this.canUpdate;
    }
    let isDeleteShow = (row) => {
      return this.canDelete;
    }
    let validatePid = (rule, value, callback) => {
      if (value && value===this.groupForm.id) {
        callback(new Error('父分组不可以是它自己'));
      }else {
        callback();
      }
    };
    let deviceTypeFilter = (value, row, column)=>{
      // 获取列对象对应数据对象的属性名
      const property = column['property'];
      return row[property] === value;
      };
    let deviceTypeArr = [
        {
          text: '摄像头',
          value: "camera",
        },
        {
          text: '报警设备',
          value: "alarm",
        },
      ];
    return {
      canUpdate: false,
      canDelete: false,

      data: [],
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 新增设备弹窗不可见
      groupFormVisible: false,
      uploadExcelVisible: false, // 上传excel对话框可见性
      distributeDialogVisible: false, // 分配分组对话框可见性
      innerVisible: false,// 分组的内层对话框可见性
      dialogName: '新增设备', // 弹窗名
      currentUserId: null,    // 当前用户id
      curGroupName: '全部',   // 当前所在组名，id=null:全部;=0:未分组设备;>0:具体组名
      curDevice: null,// 当前选中设备行
      curGroup: null,   // 当前选中组
      // 分页相关
      total: 0, // 总条目数
      pageSize: 10, // 每页显示条目数
      currentPage: 1, // 当前页，从1开始

      manufacturersOptions: [
        "海康",
        "豪恩",
        "华拓",
      ],
      // 设备类型的选项
      deviceTypeOptions: deviceTypeArr,// 使用value和label属性
      innerDialogTitle: '添加分组',
      defaultGroup: [{
        id: 0,
        label: '默认分组',
        name: '默认分组',
        // children: [],

      }],
      groupList: [], // 分组列表
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        // serialNumber: [{required: true, trigger: 'blur', message: "请输入序列号"}],
        type: [{required: true, trigger: 'blur', message: "请选择类型"}],
      },
      groupFormRules: {
        name: [{required: true, trigger: 'blur', message: "请输入分组名"}],
        pid: [{validator: validatePid, trigger: 'blur', }]
      },
      defaultProps:{  // el-tree的props
        label: 'name',   // name作为展示文字
        disable: 'children',
      },
      param:{
        keyword:'',   // 关键字
        groupId:null, // 组id
        type:'', // 类型
        start: 0, // 起始位置
        length: 10, // 页大小
      },
      form: {
        id: null,
        manufacturers: '',   // 厂家
        name: '',
        serialNumber: '', // 序列号
        type: '',
        ip: '',
        prot: '',       // 端口号
        loginName: '',
        password: '',
        createUser: this.currentUserId,
        updateUser: this.currentUserId,

        groupId: null,  // 分组id
      },
      groupForm: {
        id:null,
        name:'',
        pid:null,
        createUser: this.currentUserId,
        updateUser: this.currentUserId,
      },
      checkedDeviceNameList: [],  // 勾选的设备.name列表
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 70,
        },
        {
          text: '名称',
          value: 'name',
        },
        {
          text: '厂家',
          value: 'manufacturers',
          width: 100,
        },
        {
          text: '类型',
          value: 'type',
          width: 100,
          filters: deviceTypeArr,
          filterMethod: deviceTypeFilter,
          formatter: (row, column, cellValue, index)=>{
            if(row.type==='camera')
              return '摄像头';
            else if(row.type==='alarm')
              return '报警设备';
            return '--';
          },
        },
        {
          text: 'IP',
          value: 'ip',
          width: 130,
        },
        {
          text: '端口号',
          value: 'prot',
          width: 120,
        },
        {
          text: '序列号',
          value: 'serialNumber'
        },
        // {
        //   text: '用户名',
        //   value: 'login_name'
        // },
        // {
        //   text: '密码',
        //   value: 'password'
        // },
      ],
      tableOption: [
        {
          text: '修改',
          onclick: updateOpen,
          isShow: isUpdateShow,
        },
        {
          text: '删除',
          onclick: deleteOption,
          isShow: isDeleteShow,
        }
      ],
    }
  },
  methods: {
    normalizer,
    handleMethod(ms) {
      this[ms]();
    },
    // 在失去焦点时，保存用户自己添加的厂家类型
    selectManufacturersBlur(event){
      this.form.manufacturers = event.target.value;
    },
    // 在失去焦点时，保存用户自己添加的设备类型
    selectDeviceTypeBlur(event){
      this.form.type = event.target.value;
    },
    // 显示"添加表单"
    add() {
      this.form = {
        id: null,
        manufacturers: '',   // 厂家
        name: '',
        serialNumber: '', // 序列号
        type: '',
        ip: '',
        prot: '',       // 端口号
        loginName: '',
        password: '',
        createUser: this.currentUserId,
        updateUser: this.currentUserId,

        groupId: this.curGroup?this.curGroup.id:null,
      };
      this.dialogName = "新增设备";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    },
    // 根据条件查询设备
    search() {
      this.getDeviceList();
    },
    // 获取设备列表
    getDeviceList() {
      this.curDevice = null; // 更新列表时，通道表格清空
      getDeviceList(this.param).then(res => {
        if (res.data.errorCode === 200) {
          let a = res.data.data;
          this.data = listToTree(a);
          if (this.data != null && this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
              this.data[i].pid = 0;
            }
          }
        }
      })
    },
    // 获取分组列表
    getGroupList(){
      getGroupList().then(res => {
        if (res.data.errorCode === 200) {
          let a = res.data.data;
          this.groupList = listToTree(a);
          // setEachPid(this.groupList,-1);
          // setNotLeafDisabled(this.groupList)
        }
      }).catch(err=>{})
    },
    // 提交表单
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {return;}
        if (this.dialogName.indexOf("新增设备") !== -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success("添加成功");
              this.getDeviceList()
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
          this.dialogFormVisible = false; // 隐藏"新增"弹窗
          // 清空form?
          // 清空keyword?
        } else {//修改操作
          updateById(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success(res.data.errorMsg);
              this.getDeviceList();
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
          this.dialogFormVisible = false;
        }
      })

    },
    handleRowClick(row, column, event){
      this.curDevice = row
    },
    // 提交分组表单
    submitGroupForm(){
      this.$refs.GroupForm.validate(valid => {
        if (!valid) {return;}
        if (this.innerDialogTitle.indexOf("添加分组") !== -1) {//添加分组
          addGroup(this.groupForm).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success("添加分组成功");
              this.getGroupList()
            }else{this.$message.error(res.data.errorMsg);}
          })
          this.innerVisible = false; // 隐藏内部弹窗
        } else { // 修改分组
          updateGroupById(this.groupForm).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success("修改分组成功");
              this.getGroupList()
            }else{this.$message.error(res.data.errorMsg);}
          })
          this.innerVisible = false; // 隐藏内部弹窗
        }
      })
    },
    // 提交要删除的分组
    deleteGroups(){
      let deletedNodes = this.$refs.groupTree.getCheckedNodes();
      // 无勾选项直接返回
      if(deletedNodes.length === 0){
        this.$message.warning("未勾选分组")
        return;
      }
      let groupNames = deletedNodes.map((item)=>item.name);
      this.$confirm('即将删除[' + groupNames + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let keys = this.$refs.groupTree.getCheckedKeys();
        deleteAllGroups({idList:keys}).then(res => {
          if (res.data.errorCode === 200) {
            this.$message.success("删除分组成功");
            this.getGroupList();
          }else{
            this.$message.error(res.data.errorMsg)
          }
        })
      }).catch(()=>{});

    },

    // 刷新设备统计总数（用于分页）
    refreshTotal(groupId){
      countByGroupId(groupId).then(res => {
        if(res.data.errorCode===200){
          this.total = res.data.data;
        }
      }).catch(err=>{})
    },
    // 当前页码改变
    changePage(e){
      this.currentPage = e;
    },

    // 添加分组
    addGroup(){
      this.innerDialogTitle = '添加分组'
      this.innerVisible = true;
      this.groupForm={
        name:'',
        id: null,
        pid: null,
        createUser: this.currentUserId,
        updateUser: this.currentUserId,
      }
    },
    // 修改分组信息
    modifyGroup(data){
      this.innerDialogTitle = '修改分组信息'
      this.innerVisible = true;
      this.groupForm={
        name:data.name,
        id:data.id,
        pid:data.pid,
        updateUser: this.currentUserId,
      }
    },
    // 分组被点击时触发
    handleGroupNodeClick(node){
      // 第二次点击某节点，相当于取消点击
      if(this.param.groupId===node.id){
        // 取消选择当前节点
        this.param.groupId = null
        // 节点样式的高亮取消
        if(this.$refs.defaultGroupTree.store.currentNode){
          this.$refs.defaultGroupTree.store.currentNode = null;
        }else{
          this.$refs.groupTreeShow.store.currentNode = null;
        }
        this.curGroup = null;
      }else{// 首次点击某节点 or 点击另外的节点
        this.param.groupId = node.id;
        // 节点样式的高亮切换
        if(node.id===0){
          this.$refs.groupTreeShow.store.currentNode = null;
        } else{
          this.$refs.defaultGroupTree.store.currentNode = null;
        }
        this.curGroup = node;
      }
      this.getDeviceList()
    },
    // 将设备移动至别的分组
    distributeDevicesToGroups(){
      let deviceIdList = this.$refs.curTable.getSelectedKeys();
      let groupIdList = this.$refs.distributeTree.getCheckedKeys();
      distributeDevicesToGroups({
        deviceIdList:deviceIdList,
        groupIdList:groupIdList,
        updateUser:this.currentUserId,
        createUser:this.currentUserId,
      }).then(res => {
        if(res.data.errorCode === 200){
          this.$message.success("操作成功")
          this.getDeviceList()
        }else {
          this.$message.error(res.data.errorMsg)
        }
      }).catch(err => {
        console.log(err)
      });
      this.distributeDialogVisible = false;
    },
    // 展示"为设备分配分组"对话框
    showDistributeDialog(){

      let deviceList = this.$refs.curTable.getSelectedRows();
      if(deviceList.length===0){
        this.$message.warning("未勾选设备")
        return;
      }

      // 清空上一次留存的勾选
      this.$nextTick(()=>{this.$refs.distributeTree.setCheckedKeys([]);});

      if(deviceList.length===1){
        // 选中的设备只有一个，为复选框勾选已经所在的分组
        let groupIdList = [];
        getGroupListByDeviceId(deviceList[0].id).then(res=>{
          if(res.data.errorCode===200){
            groupIdList = res.data.data;
          }else{
            console.log("获取设备所在组失败")
          }
          // 设为勾选
          this.$refs.distributeTree.setCheckedKeys(groupIdList);
        }).catch(err => {
          console.log(err)
        })
      }
      this.checkedDeviceNameList=deviceList.map((item)=>item.name);
      this.distributeDialogVisible = true;
    },
    // 删除设备
    delete(row) {
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteById(row.id);
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.getDeviceList();
          this.$message.success("删除成功");
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{});
    },
    // 批量删除设备
    deleteAll(){
      let checkedIdList = this.$refs.curTable.getSelectedKeys();
      // 判空
      if( ! checkedIdList.length ){
        this.$message.warning("未勾选数据");
        return ;
      }
      let checkedRowList = this.$refs.curTable.getSelectedRows(); // 被勾选的列数组
      let deletedNameList = checkedRowList.map(e=>e.name);  // 待删除列的名字列表
      this.$confirm('即将删除[' + deletedNameList + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口
        return deleteAll(checkedIdList);
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.$message.success("批量删除成功");
          this.getDeviceList()
        } else {
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err => {})
    },
    ///// websocket test
    // websocketTest(){
    //   this.init();
    // },
    // init: function () {
    //   if(typeof(WebSocket) === "undefined"){
    //     alert("您的浏览器不支持socket")
    //   }else{
    //     // 实例化socket
    //     //// ws://{baseURL}/websocket/stream/{sessionId}
    //     this.path = "ws://localhost:8888/websocket/stream/9587";
    //     this.socket = new WebSocket(this.path)
    //     // 监听socket连接，错误，消息，关闭
    //     this.socket.onopen = this.open;
    //     this.socket.onerror = this.error;
    //     this.socket.onmessage = this.getMessage;
    //     this.socket.onclose = this.close;
    //   }
    // },
    // open: function () {
    //   let data = {
    //     method: 'selectStream',
    //   }
    //   this.send(JSON.stringify(data))
    //   console.log("socket连接成功")
    //   let inputstr = prompt("请输入","");
    //   this.socket.send(JSON.stringify({method:inputstr}));
    // },
    // error: function () {
    //   console.log("连接错误")
    // },
    // getMessage: function (msg) {
    //   console.log(msg.data)
    // },
    // send: function (data) {
    //   this.socket.send(data)
    //   console.log("data is " + data)
    // },
    // close: function (e) {
    //   console.log("socket已经关闭")
    // },

    // //// 上传excel相关
    // /**
    //  * 在上传文件之前执行，判断文件大小
    //  * @param rawFile 文件对象
    //  * @returns {boolean} 是否允许上传
    //  */
    // beforeUpload(rawFile){
    //   // console.log(rawFile);
    //   if(rawFile.size>=20*1024*1024){
    //     this.$message.error("上传的文件应小于20m");
    //     return false;
    //   }
    //   return true;
    // },
    // /**
    //  * 上传excel成功执行的函数
    //  * @returns {boolean}
    //  */
    // onSuccess(){
    //   console.log("onSuccess");
    //   console.log(this.$refs.uploadExcel.excelData)
    //   return true;
    // },

  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    let that = this;
    this.bttns.forEach(function (item, index, array) {
      if (item.methodd === 'deleteAll'){
        that.canDelete = true;
      }else if(item.methodd === 'update'){
        that.canUpdate = true;
        item.invisible = true;
      }
    })
    this.getGroupList();
    this.getDeviceList();
    this.currentUserId = JSON.parse(getUser()).id;
    this.refreshTotal(null);
    //////  ws test
    // this.websocketTest();
  },
  watch: {
    // 如果分组被切换，通道不显示数据
    'param.groupId'(newVal, oldVal){
      this.curDevice = null;
    },
    // 选中的分组被切换，"当前分组名"随之改变, 分页计数也改变
    curGroup(newVal, oldVal){
      if(newVal){
        this.curGroupName = newVal.name;
        this.refreshTotal(newVal.id);
      }else{
        this.curGroupName = '全部';
        this.refreshTotal(null);
      }
      this.currentPage = 1;
    },
    currentPage(newVal, oldVal){
      this.param.start=(newVal-1)*this.pageSize;
      this.param.length=this.pageSize;
      this.getDeviceList();
    }
  },
  computed:{
    // 当前选中设备的名称
    curDeviceName(){
      return this.curDevice==null ? "--" : this.curDevice.name;
    },
    // 总页数
    pageCount(){
      return this.total / this.pageSize;
    },
  },
}
</script>

<style scoped>

/*设置高亮的节点样式*/
/deep/.el-tree--highlight-current
.el-tree-node.is-current
> .el-tree-node__content {
  background-color:  rgba(35, 220, 205, 0.78);
}

/*分组设置中的组树的样式*/
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
