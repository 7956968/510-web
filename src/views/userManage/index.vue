<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getUserList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <tree-table :data="data" :columns="columns" :options="tableOption" border/>
<!--      <el-table :data="data" border>-->
<!--        <el-table-column-->
<!--          v-for="(column, index) in columns"-->
<!--          :key="column.value"-->
<!--          :label="column.text"-->
<!--          :width="column.width "-->
<!--        >-->

<!--        </el-table-column>-->
<!--      </el-table>-->

    </div>

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center>
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" size="small">
            <el-radio-button :label="0">暂时不填</el-radio-button>
            <el-radio-button :label="1">男</el-radio-button>
            <el-radio-button :label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工号" prop="jobNumber">
          <el-input v-model="form.jobNumber" placeholder="请输入工号" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select placeholder="请选择角色"
                     v-model="form.roleId"
                     >
            <el-option
              v-for="(item,idx) in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" style="width: auto" >
<!--            <i slot="suffix" class="el-input_icon el-icon-view" @click="showPsw"></i>-->
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordAgain">
          <el-input v-model="form.passwordAgain" placeholder="请再次输入密码" style="width: auto" >

          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="itemStatus">
          <el-select placeholder="请选择状态"
                     v-model="form.itemStatus"
                     style="width: auto">
            <el-option
              v-for="(item,idx) in statusOptions"
              :key="idx"
              :value="item.value"
              :label="item.label"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <selectTree
            style="width: 79%"
            placeholder="请选择部门"
            ref="selectTreeDept"
            :options="departmentList"
            v-model="form.departmentId"
            clearable
            :defaultExpandLevel="3"
            accordion="true"
            :normalizer="normalizer"
          />
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
import {getUserList, add, updateById, deleteById} from '@/api/userManage';
import {getDepartmentList } from '@/api/department';
import {getRoleList } from '@/api/role';
import {listToTree, copyProperties} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from "@riophae/vue-treeselect";

export default {
  name: "index",
  components:{
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.formRules.password[0].required = false;
      this.formRules.passwordAgain[0].required = false;
      this.dialogName = "修改";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    }
    let deleteOption = (row) => {this.delete(row);}
    let isUpdateShow = (row) => {
      return this.canUpdate;
    }
    let isDeleteShow = (row) => {return row.deleteable;}
    let validatePsw2 = (rule, value, callback) => {
      if( ! this.formRules.password[0].required){
        callback();
      }else
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      bttns: [],
      canUpdate: true, // 当前登录角色的修改权限
      canDelete: true, // 同上，删除
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],           // 表格数据
      statusOptions: [    // 用户状态选择表
        {
          value:true,
          label:'正常',
        },
        {
          value:false,
          label:'已删除',
        }
      ],

      departmentList: [],   // 部门列表
      roleList: [],       // 角色列表
      defaultProps:{  // el-tree的props
        label: 'name',   // 权限列表的name作为展示文字
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        jobNumber: [{required: true, trigger: 'blur', message: "请输入工号"}],
        gender: [{required: true, trigger: 'blur', message: "请选择性别"}],
        // career: [{required: true, trigger: 'blur', message: "请填写职位"}],
        // phone: [{required: true, trigger: 'blur', message: "请输入手机号"}],
        // email:  [{required: true, trigger: 'blur', message: "请输入邮箱"}],
        password: [{required: true, trigger: 'blur', message: "请输入密码"}],
        passwordAgain: [{validator: validatePsw2, required: true, trigger: 'blur' }],
        roleId: [{required: true, trigger: 'blur', message: "请选择角色"}],
        // departmentId: [{required: true, trigger: 'blur', message: "请选择部门"}],
        itemStatus: [{required: true, trigger: 'blur', message: "请选择状态"}],
      },
      param:{
        // 检索用的关键字
        keyword:''
      },
      form: {
        id: null,
        roleId: '',
        jobNumber: '',
        position: '',
        name: '',
        password: '',
        passwordAgain:'',
        gender: null,
        phone: '',
        email: '',
        departmentId: null,
        itemStatus: '',
      },
      columns: [
        {
          text: '姓名',
          value: 'name'
        },
        {
          text: '性别',
          value: 'gender'
        },
        {
          text: '工号',
          value: 'jobNumber'
        },
        {
          text: '职位',
          value: 'position'
        },
        {
          text: '角色',
          value: 'roleId'
        },
        {
          text: '手机号',
          value: 'phone'
        },
        {
          text: '状态',
          value: 'itemStatus',
        },
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
    search() {
      this.getUserList();
    },
    add() {
      this.form = {
        id: null,
        roleId: '',
        jobNumber: '',
        position: '',
        name: '',
        password: '',
        passwordAgain:'',
        gender: null,
        phone: '',
        email: '',
        departmentId: null,
        itemStatus: true,
      };
      this.formRules.password[0].required = true;
      this.formRules.passwordAgain[0].required = true;
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    },
    getUserList() {
      getUserList(this.param).then(res => {
        if (res.data.errorCode === 200) {
          let a = res.data.data;
          this.data = listToTree(a);
          if (this.data != null && this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
              this.data[i].pid = 0;
            }
          }
          //this.options = re.data.data;
        }
      })
    },
    submitForm() {
      console.log(this.form)
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {return;}
        if (this.dialogName.indexOf("新增") !== -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success(res.data.errorMsg);
              this.getUserList();
              this.dialogFormVisible = false;
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
        } else {//修改操作
          updateById(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success(res.data.errorMsg);
              this.getUserList();
              this.dialogFormVisible = false;
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
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
            this.getUserList();
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
    deptChosen(){
      console.log("in deptChosen")
    },
    showPsw(){
      console.log("in showPsw")
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    // this.bttns.forEach(function (value, index, array) {})
    this.getUserList();
    // 将部门列表存放
    getDepartmentList().then(res => {
      if (res.data.errorCode === 200) {
        let a = res.data.data;
        this.departmentList = listToTree(a);
      }
    })
    // 将角色列表存放
    getRoleList().then(res => {
      if (res.data.errorCode === 200) {
        let a = res.data.data;
        this.roleList = listToTree(a);
      }
    })


  }
}
</script>

<style scoped>

</style>
