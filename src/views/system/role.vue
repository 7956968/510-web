<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-for="item in bttns" type="primary" size="mini" :icon="item.icon"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <tree-table :data="data" :columns="columns" :options="tableOption" border/>
    </div>

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center>
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="描述" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="菜单操作权限">
          <el-tree
            style="width: 79%"
            placeholder="请选择"
            :data="permissionList"
            v-model="form.permissions"
            show-checkbox
            default-expand-all
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
import {getRoleList, add, updateById, deleteById} from '@/api/role';
import {getPermissionListByRoleId, add as addRP, deleteById as deleteRPById} from '@/api/rolePermission';
import {listToTree, copyProperties} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'

export default {
  name: "role",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      delete row.children;
      row.pid = null;
      // this.form = copyProperties(row,this.form);

      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定

      this.form.isUpdate = row.isUpdate == true ? 1 : 0;
      this.form.isDelete = row.isDelete == true ? 1 : 0;

      this.codeReadonly = true;
      this.dialogName = "修改";
      this.dialogFormVisible = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    }
    let deleteOption = (row) => {
      this.delete(row);
    }
    let isUpdateShow = (row) => {
      return row.isUpdate == 1;
    }
    let isDeleteShow = (row) => {
      return row.isDelete == 1 && (!row.children || row.children.length == 0);
    }
    return {
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],
      currentRoleId: null,
      // 当前登录角色所拥有的权限列表
      permissionList: [],
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        description: [{required: true, trigger: 'blur', message: "请输入描述"}],
      },
      param:{
        // 查询的关键字
        keyword:''
      },
      form: {
        id: null,
        name: '',
        description: '',
        // 赋予新增角色的权限
        permissions: [],
      },
      columns: [
        {
          text: '名称',
          value: 'name'
        },
        {
          text: '描述',
          value: 'description'
        },
        {
          text: '创建时间',
          value: 'createTime'
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
    // 后台返回的数据和VueTreeselect要求的数据结构不同，需要进行转换
    // normalizer(node) {
    //   //去掉children=[]的children属性
    //   if (node.children && !node.children.length) {
    //     delete node.children;
    //   }
    //   return {
    //     id: node.id,
    //     label: node.title,
    //     children: node.children
    //   }
    // },
    handleMethod(ms) {
      this[ms]();
    },
    search() {
      this.getRoleList();
    },
    add() {
      this.form = {
        name: '',
        description: '',
      /////  角色权限
      };
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      // this.$refs.dialogForm.clearValidate();//清除校验结果
      // 获取当前角色的权限列表, 提供给“新建角色”的表单
      getPermissionListByRoleId(this.currentRoleId).then(res =>{
        if (res.data.errorCode == 200) {
          let a = res.data.data;
          this.permissionList = listToTree(a);
          console.log(this.permissionList)
          // this.permissionList = a;
        }
        this.$message.success(res.data.errorMsg);
      })
      console.log(this.permissionList)
    },
    getRoleList() {
      getRoleList(this.param).then(res => {
        if (res.data.errorCode == 200) {
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
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        // this.form.isDelete = this.form.isDelete == 1 ? true : false;
        // this.form.isUpdate = this.form.isUpdate == 1 ? true : false;
        if (this.dialogName.indexOf("新增") != -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode == 200) {
              this.getRoleList();
              this.dialogFormVisible = false;
            }
            this.$message.success(res.data.errorMsg);
          })
        } else {//修改操作
          // this.form.isDelete = this.form.isDelete == 1 ? true : false;
          // this.form.isUpdate = this.form.isUpdate == 1 ? true : false;
          // console.log(this.form)
          updateById(this.form).then(res => {
            if (res.data.errorCode == 200) {
              this.getRoleList();
              this.dialogFormVisible = false;
            }
            this.$message.success(res.data.errorMsg);
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
          if (res.data.errorCode == 200) {
            this.getRoleList();
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
  },

  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.bttns.forEach(function (value, index, array) {
    })
    this.getRoleList();
    // console.log(JSON.parse(getUser()))
    this.currentRoleId = JSON.parse(getUser()).roleId;
  },
  mounted() {

  }
}
</script>

<style scoped>
.item-lable {
  width: 17%;
}
</style>
