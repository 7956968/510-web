<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model.trim="param.keyword"
                    placeholder="请输入关键字"
                    maxlength="255"
                    clearable
                    @blur="getUserList"
                    @keydown.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <!-- 失去焦点触发可以添加属性@blur="getUserList"-->
          <el-select v-model.trim="param.itemStatus"
                     placeholder="请选择用户状态"
                     clearable
          >
            <el-option
              v-for="(item,idx) in statusOptions"
              :key="item.index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)"
                     v-if="!item.invisible"
          >{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <tree-table :data="data"
                  :columns="columns"
                  :options="tableOption"
                  border
                  not-tree
                  ref="curTable"
                  :rowSelectable="rowSelectable"
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
    </div>

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center :close-on-click-modal="false">
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="form.name" placeholder="姓名" maxlength="50" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" size="small">
            <!--<el-radio-button :label="0">暂时不填</el-radio-button>-->
            <el-radio-button :label="1">男</el-radio-button>
            <el-radio-button :label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工号" prop="jobNumber">
          <el-input v-model.trim="form.jobNumber" placeholder="请输入工号" maxlength="50" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model.trim="form.position" placeholder="请输入职位" maxlength="50" style="width: auto"></el-input>
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
          <el-input v-model.trim="form.phone" placeholder="请输入手机号" maxlength="20" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱" maxlength="30" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码" maxlength="50" style="width: auto" :type="passwordType">
            <i slot="suffix" :class="passwordIcon" @click="showPwd"/>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordAgain">
          <el-input v-model.trim="form.passwordAgain" placeholder="请再次输入密码" maxlength="50" style="width: auto" :type="password2Type">
            <i slot="suffix" :class="password2Icon" @click="showPwd2"/>
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
              :label="item.text"
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
import {getUserList, add, updateById, deleteById, deleteAll} from '@/api/userManage';
import {getDepartmentList } from '@/api/department';
import {getRoleList } from '@/api/role';
import {listToTree, copyProperties, normalizer} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {isValidatePhone} from '@/utils/validate';

export default {
  name: "index",
  components:{
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      this.form = JSON.parse(JSON.stringify(row)); // 解除数据绑定
      if(row.departmentId===0){this.form.departmentId=null} // 让表单中部门项选择不显示0(null)而是空白
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
    let isDeleteShow = (row) => {return row.deleteable && this.canDelete;}
    let validatePsw2 = (rule, value, callback) => { // 二次密码校验
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
      canUpdate: false, // 当前登录角色的修改权限
      canDelete: false, // 同上，删除
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],           // 表格数据
      statusOptions: [    // 用户状态选择表
        {
          value: 1,
          text:'正常',
        },
        {
          value: 0,
          text:'已删除',
        }
      ],

      departmentList: [],   // 部门列表
      roleList: [],       // 角色列表
      departmentDict: {}, // 部门字典
      roleDict: {},       // 角色字典
      defaultProps:{  // el-tree的props
        label: 'name',   // 权限列表的name作为展示文字
      },
      passwordType: 'password',
      password2Type: 'password',
      passwordIcon: 'el-input__icon el-icon-view',
      password2Icon: 'el-input__icon el-icon-view',
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        jobNumber: [{required: true, trigger: 'blur', message: "请输入工号"}],
        gender: [{required: true, trigger: 'blur', message: "请选择性别"}],
        // career: [{required: true, trigger: 'blur', message: "请填写职位"}],
        phone: [
            // {required: true, message: '请输入手机号码', trigger: 'blur'},
            {
              validator: function (rule, value, callback) {
                // 这里假定手机号不是必填项, 允许为空
                if (value===''){
                  callback();
                }
                if ( ! isValidatePhone(value)) {
                  callback(new Error("手机号格式错误"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
        ],
        email:  [{type:'email', trigger: 'blur', message: "邮箱格式有误"}],
        password: [
          {required: true, trigger: 'blur', message: "请输入密码"},
          { min:6, max:20, message:'长度为 6 到 20 个字符'},
          {pattern: /^(\w){6,20}$/, message: '只能输入字母、数字、下划线'},
        ],
        passwordAgain: [{validator: validatePsw2, required: true, trigger: 'blur' }],
        roleId: [{required: true, trigger: 'blur', message: "请选择角色"}],
        // departmentId: [{required: true, trigger: 'blur', message: "请选择部门"}],
        itemStatus: [{required: true, trigger: 'blur', message: "请选择状态"}],
      },
      param:{
        keyword: '',// 关键字
        itemStatus: null,// 用户状态
        start: 1,// 页号，从1开始
        length: 10,// 页大小
      },
      // 分页相关
      total: 0, // 总条目数
      pageSize: 10, // 每页显示条目数
      currentPage: 1, // 当前页，从1开始
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
        itemStatus: 1,
      },
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 80,
          sortable: true,
        },
        {
          text: '姓名',
          value: 'name',
          width: 120,
          sortable: true,
        },
        {
          text: '性别',
          value: 'gender',
          width: 50,
          formatter: (row, column, cellValue, index)=>{
            switch(row.gender){
              case 1: return '男';
              case 2: return '女';
              default: return '--';
            }
          },
        },
        {
          text: '工号',
          value: 'jobNumber',
          sortable: true,
        },
        {
          text: '职位',
          value: 'position',
          width: 150,
          sortable: true,
        },
        {
          text: '角色',
          value: 'roleId',
          width: 150,
          formatter: (row, column, cellValue, index)=>{
            let a = this.roleDict[row.roleId];
            return (a && a.name) || '--';
          }
        },
        {
          text: '部门',
          value: 'departmentId',
          width: 140,
          formatter: (row, column, cellValue, index)=>{
            let a = this.departmentDict[row.departmentId];
            return (a && a.name) || '--';
          },

        },
        {
          text: '手机号',
          value: 'phone',
          width: 150,
        },
        {
          text: '邮箱',
          value: 'email',
          width: 150,
        },
        {
          text: '状态',
          value: 'itemStatus',
          width: 70,
          formatter: (row, column, cellValue, index)=>{
            switch (row.itemStatus){
              case 1: return '正常';
              default: return '已删除';
            }
          }
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
    normalizer,
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
        itemStatus: 1,
      };
      this.formRules.password[0].required = true;
      this.formRules.passwordAgain[0].required = true;
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    },
    async getUserList() {
      if (this.roleDict === null || Object.keys(this.roleDict).length === 0) {
        await this.refreshRoleDict();
      }
      if (this.departmentDict === null || Object.keys(this.departmentDict).length === 0) {
        await this.refreshDepartmentDict();
      }
      getUserList(this.param).then(res => {
        if (res.data.errorCode === 200) {
          this.data = res.data.data.list;
          this.total = res.data.data.total;
          this.$message.success("查询成功")
        } else {
          this.$message.error(res.data.errorMsg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取角色列表，并将角色列表（id到name的映射）存放在roleDict中
     */
    refreshRoleDict(){
       getRoleList().then(res => {
        if (res.data.errorCode === 200) {
          let a = res.data.data;
          this.roleList = listToTree(a);
          // 建立角色字典
          a.forEach(item=>{
            this.roleDict[item.id] = item;
          });
        }
      });
    },
    /**
     * 获取部门列表，并将部门列表（id到name的映射）存放在departmentDict中
     */
    refreshDepartmentDict(){
      return getDepartmentList().then(res => {
        if (res.data.errorCode === 200) {
          let a = res.data.data;
          this.departmentList = listToTree(a);
          // 建立部门字典
          a.forEach(item=>{
            this.departmentDict[item.id] = item;
          });
        }
      });
    },
    /**
     * 设置可以被删除的用户，勾选项可点击
     * @param row
     * @param rowIndex
     * @returns {boolean} true为可勾选
     */
    rowSelectable(row, rowIndex){
      return row.itemStatus!==0;
    },
    submitForm() {
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
        return deleteById(row.id);
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.getUserList();
          this.$message.success("删除成功");
        }else{
          this.$message.success(res.data.errorMsg);
        }
      }).catch(err=>{});
    },
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
        if(res.data.errorCode === 200){
          this.$message.success("批量删除成功");
          this.getUserList()
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{})
    },
    // 当前页码改变时，保存改变的页码
    changePage(e){
      this.currentPage = e;
    },
    // 添加/修改用户表单，密码的显示隐藏
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
        this.passwordIcon = 'el-input__icon el-icon-minus';
      } else {
        this.passwordType = 'password'
        this.passwordIcon = 'el-input__icon el-icon-view';
      }
    },
    // 添加/修改用户表单，二次输入密码的显示隐藏
    showPwd2() {
      if (this.password2Type === 'password') {
        this.password2Type = '';
        this.password2Icon = 'el-input__icon el-icon-minus';
      } else {
        this.password2Type = 'password'
        this.password2Icon = 'el-input__icon el-icon-view';
      }
    },
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
    this.getUserList();
  },
  watch: {
    currentPage(newVal, oldVal){
      this.param.start=newVal;
      this.param.length=this.pageSize;
      this.getUserList();
    }
  },
}
</script>

<style scoped>

</style>
