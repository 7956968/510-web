<template>
  <div class="content_container">

    <!-- 侧边分组 -->
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-tree :data="groupList" :props="defaultProps" @node-click="handleGroupNodeClick"></el-tree>
    </el-aside>



    <!-- 顶栏按钮 -->
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getDeviceList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <tree-table :data="data" :columns="columns" :options="tableOption" border expandAll
                  @selection-change="handleSelectionChange"/>
    </div>

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
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="序列号" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" style="width: auto"></el-input>
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
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {listToTree, copyProperties, setEachPidZero} from '@/utils';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'
import {getDeviceList, add, updateById, deleteById, getGroupList, addGroup, updateGroupById, deleteGroupById} from '@/api/device';


export default {
  name: "index",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.form.updateUser = this.currentUserId
      this.dialogName = "修改";
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
    return {
      data: [],
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      currentUserId: null,    // 当前用户id
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
      groupList: [],
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        // serialNumber: [{required: true, trigger: 'blur', message: "请输入序列号"}],
      },
      defaultProps:{  // el-tree的props
        label: 'name',   // name作为展示文字
      },
      param:{
        keyword:'',   // 关键字
        groupId:null, // 组id
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
      columns: [
        {
          text: '名称',
          value: 'name',
          align: 'right'
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
    // 后台返回的数据和VueTreeselect要求的数据结构不同，需要进行转换
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    handleMethod(ms) {
      this[ms]();
    },
    handleSelectionChange(val){
      console.log(val)
    },
    // 在失去焦点时，保存用户自己添加的厂家类型
    selectManufacturersBlur(event){
      this.form.manufacturers = event.target.value;
    },
    // 在失去焦点时，保存用户自己添加的设备类型
    selectDeviceTypeBlur(event){
      this.form.type = event.target.value;
    },
    // 分组被点击时触发
    handleGroupNodeClick(){
      console.log("in handleGroupNodeClick")
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
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    },
    search() {
      this.getDeviceList();
    },
    // 获取设备列表
    getDeviceList() {
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
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.dialogName.indexOf("新增") !== -1) {//添加操作
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
      });
    },
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    // this.bttns.forEach(function (value, index, array) {})
    this.getGroupList();
    this.getDeviceList();
    this.currentUserId = JSON.parse(getUser()).id;
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
