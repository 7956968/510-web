<template>
  <div class="content_container">
    <el-container>
    <!-- 顶栏按钮 -->
    <el-header>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <!-- 失去焦点触发可以添加属性@blur="getDeviceList"-->
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable/>
        </el-form-item>
        <el-form-item label="设备类型" prop="">
          <!-- 失去焦点触发可以添加属性@blur="getDeviceList"-->
          <el-select v-model="param.type"
                     placeholder="请选择设备类型"
                     clearable
          >
            <el-option
              v-for="(item,idx) in deviceTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
          <el-button @click="showMoveDialog" style="font-size: 18px">
            转移至分组
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <el-container >
      <!-- 侧边分组 -->
      <el-aside width="200px" style="height: 650px; border: 1px solid #000000">
        <el-row style="margin-top:10px;margin-bottom:10px;text-align:center">
        <el-button @click="groupFormVisible=true"
                   style="background:#e3e4f5;"
                   icon="el-icon-setting"
                   size="middle"
        >分组设置</el-button>
        </el-row>
        <el-row style="margin-top:10px;margin-bottom:10px;text-align:center">
        <el-button @click="setNotInGroup"
                   :type="btnType"
                   icon="el-icon-search"
                   size="middle"
        >未分组设备</el-button>
        </el-row>
        <div style="margin-top:10px;margin-bottom:10px;background:#d7ee0a;height:30px;text-align:center;line-height: 30px">
          分组列表
        </div>

        <el-tree :data="groupList"
                 :props="defaultProps"
                 @node-click="handleGroupNodeClick"
                 highlight-current
                 empty-text="当前无分组"
                 default-expand-all
                 :expand-on-click-node="false"
                 ref="groupTreeShow"
        ></el-tree>
      </el-aside>
      <!-- 表格-->
      <el-main>
        <!--与设备表格保持距离-->
        <div  >
          当前所在组: {{curGroupName}}
        </div>
        <tree-table :data="data"
                    :columns="columns"
                    :options="tableOption"
                    border
                    ref="deviceTable"
                    :handle-row-click="handleRowClick"
                    highlight-current-row
                    not-tree
        />
        <!--与设备表格保持距离-->
        <div style="margin-top:40px;" >
          当前选中设备: {{curDeviceName}}
        </div>
        <!--表格[通道, 联动摄像头]-->
        <el-tabs type="border-card">
          <el-tab-pane label="通道">
            <channel :device="curDevice"></channel>
          </el-tab-pane>
          <el-tab-pane label="联动摄像头">
            <liandong :device="curDevice"
                      :group-list="groupList"
            ></liandong>
          </el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>
    </el-container>
    <!--add/modify 设备表单-->
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center>
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="厂家" prop="manufacturers">
          <el-select
            placeholder="请选择厂家"
            v-model="form.manufacturers"
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
          <el-input v-model="form.name" placeholder="名称" style="width: auto"></el-input>
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
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="序列号" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model="form.loginName" placeholder="请输入用户名" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="prot">
          <el-input v-model="form.prot" placeholder="请输入端口号" style="width: auto"></el-input>
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
    >
      <div style="height: 500px;" >
        <el-alert
          title=""
          type="info"
          center
        >
          点击右侧<i class="el-icon-edit"></i>对分组修改
        </el-alert>
        <span>
          <el-tree :data="groupList"
                   :props="defaultProps"
                   show-checkbox
                   default-expand-all
                   ref="groupTree"
                   node-key="id"
                   empty-text="当前无分组"
                   check-strictly
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
        append-to-body>
        <el-form :model="groupForm" ref="GroupForm" :rules="groupFormRules" :label-position="labelPosition" label-width="100px"
                 size="mini">
          <el-form-item label="分组名" prop="name">
            <el-input v-model="groupForm.name" placeholder="请输入组名" />
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

    <!-- 转移设备分组的弹窗 -->
    <el-dialog title="转移至分组"
               :visible.sync="moveDialogVisible"
               @close=""
               center
    >
      <el-row style="margin: 15px 0;text-align:center;font-size: 22px">将设备{{checkedDeviceNameList}}</el-row>
      <el-row style="margin: 15px 0;text-align:center;font-size: 22px">移动至</el-row>
      <div style="text-align:center">
        <selectTree
          style="width:270px;margin:auto;font-size: 18px"
          placeholder="请选择分组"
          ref="selectTreeGroup2"
          :options="groupList"
          v-model="moveForm.groupId"
          clearable
          accordion="true"
          :defaultExpandLevel=3
          :normalizer="normalizer"
        />* 若不选，则设为未分组设备
      </div>
      <div style="margin: 15px 0;text-align:center">
        <el-button @click="moveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="moveDevicesToGroups">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {listToTree, copyProperties, setEachPidZero, setNotLeafDisabled, normalizer} from '@/utils';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'
import {getDeviceList, add, updateById, deleteById,
  getGroupList, addGroup, updateGroupById, deleteAllGroups,
  moveDevicesToGroups} from '@/api/device';
import channel from "./channel";
import liandong from "./liandong";


export default {
  name: "index",
  components: {
    channel,
    liandong,
    Dialog,
    treeTable,
    selectTree
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
      return true;
    }
    let isDeleteShow = (row) => {
      return (!row.children || row.children.length === 0);
    }
    let validatePid = (rule, value, callback) => {
      if (value && value===this.groupForm.id) {
        callback(new Error('父分组不可以是它自己'));
      }else {
        callback();
      }
    };
    return {
      data: [],
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 新增设备弹窗不可见
      groupFormVisible: false,
      moveDialogVisible: false,
      innerVisible: false,// 分组的内层对话框可见性
      dialogName: '新增设备', // 弹窗名
      currentUserId: null,    // 当前用户id
      btnType: 'plain',   // "未分组设备"按钮的类型，按下会变蓝
      curGroupName: '全部',   // 当前所在组名，id=null:全部;=0:未分组设备;>0:具体组名
      curDevice: null,// 当前选中列
      manufacturersOptions: [
        "海康",
        "豪恩",
        "华拓",
      ],
      deviceTypeOptions: [
        "摄像头",
        "温感报警器",
        "烟感报警器",
        "手动报警按钮",
        "门禁读卡器",
      ],
      innerDialogTitle: '添加分组',
      groupList: [],
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        // serialNumber: [{required: true, trigger: 'blur', message: "请输入序列号"}],
      },
      groupFormRules: {
        name: [{required: true, trigger: 'blur', message: "请输入分组名"}],
        pid: [{validator: validatePid, trigger: 'blur', }]
      },
      defaultProps:{  // el-tree的props
        label: 'name',   // name作为展示文字
      },
      param:{
        keyword:'',   // 关键字
        groupId:null, // 组id
        type:'',
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
      },
      groupForm: {
        id:null,
        name:'',
        pid:null,
        createUser: this.currentUserId,
        updateUser: this.currentUserId,
      },
      moveForm:{    // 设备转移分组的表单
        groupId:null,
        createUser:this.currentUserId,
        updateUser:this.currentUserId,
      },
      checkedDeviceNameList: [],  // 勾选的设备.name列表
      columns: [
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
          text: '类型',
          value: 'type'
        },
        {
          text: 'IP',
          value: 'ip'
        },
        {
          text: '端口号',
          value: 'prot'
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
    normalizer(node) {
      return normalizer(node)
    },
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
      };
      this.dialogName = "新增设备";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    },
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
    getGroupList(){
      getGroupList().then(res => {
        if (res.data.errorCode === 200) {
          let a = res.data.data;
          this.groupList = listToTree(a);
          setEachPidZero(this.groupList);
          setNotLeafDisabled(this.groupList)
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {return;}
        if (this.dialogName.indexOf("新增设备") !== -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success(res.data.errorMsg);
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
      if(this.param.groupId===node.id){
        // 取消选择当前节点
        this.param.groupId = null
        this.$refs.groupTreeShow.store.currentNode = null;
        this.curGroupName = "全部";
      }else{
        this.param.groupId = node.id
        this.btnType = 'plain'
        this.curGroupName = node.name;
      }
      this.getDeviceList()
    },
    // 设置要查找的设备是无分组的
    setNotInGroup(){
      if(this.param.groupId){
        // 如果选择了分组，将选择的分组取消
        this.$refs.groupTreeShow.store.currentNode = null;
      }
      this.param.groupId = this.param.groupId===0?null:0;
      this.btnType = this.param.groupId===0?'primary':'plain';
      this.curGroupName =  this.param.groupId===0?'未分组设备':'全部';
      this.getDeviceList()
    },
    // 将设备移动至别的分组
    moveDevicesToGroups(){
      let deviceIdList = this.$refs.deviceTable.getSelectedKeys();
      moveDevicesToGroups({
        groupId:this.moveForm.groupId,
        deviceIdList:deviceIdList,
        updateUser:this.currentUserId,
        createUser:this.currentUserId,
      }).then(res => {
        if(res.data.errorCode === 200){
          this.$message.success("转移分组成功")
          this.getDeviceList()
        }else {
          this.$message.error(res.data.errorMsg)
        }
      }).catch(err => {
        console.log(err)
      });
      this.moveDialogVisible = false;
    },
    // 展示"移动至分组"对话框
    showMoveDialog(){
      let deviceList = this.$refs.deviceTable.getSelectedRows();
      if(deviceList.length===0){
        this.$message.warning("未勾选设备")
        return;
      }
      this.checkedDeviceNameList=deviceList.map((item)=>item.name);
      this.moveDialogVisible = true;
      this.moveForm.groupId = null;
    },
    // 删除设备
    delete(row) {
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(res => {
          if (res.data.errorCode === 200) {
            this.getDeviceList();
            this.$message.success(res.data.errorMsg);
          }else{
            this.$message.error(res.data.errorMsg);
          }
        });
      }).catch(err=>{});
    },
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    // this.bttns.forEach(function (value, index, array) {})
    this.getGroupList();
    this.getDeviceList();
    this.currentUserId = JSON.parse(getUser()).id;
  },
  watch: {
    // 如果分组被切换，通道不显示数据
    'param.groupId'(newVal, oldVal){
      this.curDevice = null
    }
  },
  computed:{
    curDeviceName(){
      return this.curDevice==null ? "--" : this.curDevice.name;
    }
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
