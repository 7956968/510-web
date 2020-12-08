<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns" type="primary" size="mini" :icon="item.icon"
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
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
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
import {getRoleList, add, updateById, deleteById, getLast} from '@/api/role';
import {getPermissionListByRoleId, addAll as addRPAll, deleteByRoleId} from '@/api/rolePermission';
import {listToTree, copyProperties, findIntersect} from '@/utils';
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
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.dialogName = "修改";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{
        this.$refs["dialogForm"].clearValidate();
      })
    }
    let viewOptions = (row) => {
      this.showPermissionList(row.id)
      this.dialogName = "查看权限";
      this.dialogFormVisible = true;
      //////
      getPermissionListByRoleId(row.id).then(res => {
        this.permissionListTmp = res.data.data.
      })

    }
    let deleteOption = (row) => {
      this.delete(row);
    }
    let isUpdateShow = (row) => {
      return row.changeable;
    }
    let isDeleteShow = (row) => {
      return row.deleteable
    }
    return {
      bttns: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],
      currentRoleId: null,  // 当前登录角色id
      permissionList: [],   // 当前登录角色所拥有的权限列表
      addedRoleId: null,    // 新增角色的id
      permissionListTmp: [],   // 缓存的权限列表
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
      },
      // 赋予新增角色的权限
      // permissionsIdSelected: [],
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
      // 表格右边的操作按钮
      tableOption: [
        {
          text: '修改',
          onclick: updateOpen,
          isShow: isUpdateShow,
        },
        {
          text: '查看权限',
          onclick: viewOptions,
          isShow: ()=>true,
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
    handleMethod(ms) {
      this[ms]();
    },
    search() {
      this.getRoleList();
    },
    add() {
      this.form = {
        id: null,
        name: '',
        description: '',
      };
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{
        this.$refs["dialogForm"].clearValidate();
      })
      // 获取当前角色的权限列表, 提供给“新建角色”的表单
      this.showPermissionList(this.currentRoleId)
    },
    /**
     * 展示当前角色权限列表
     * @param roleId
     */
    showMyPermissionList() {
      getPermissionListByRoleId(this.currentRoleId).then(res =>{
        if (res.data.errorCode == 200) {
          this.$message.success(res.data.errorMsg);
          let a = res.data.data;
          // 将权限名字赋值给label属性
          for (let i = 0; i< a.length; i++){
            a[i].label = a[i].title
          }
          // 数组转树
          this.permissionList = listToTree(a);
        }else{
          this.$message.error(res.data.errorMsg);
        }
      })
    },
    /**
     * 展示某角色相对于当前管理员的列表
     * @param roleId
     */
    showPermissionList(roleId) {
      getPermissionListByRoleId(roleId).then(res =>{
        if (res.data.errorCode == 200) {
          let a = res.data.data;
          // 将权限名字赋值给label属性
          for (let i = 0; i< a.length; i++){
            a[i].label = a[i].title
          }
          // 数组转树
          this.permissionList = listToTree(a);
        }
        this.$message.success(res.data.errorMsg);
      })
    },


    getRoleList() {
      getRoleList(this.param).then(res => {
        if (res.data.errorCode == 200) {
          let a = res.data.data;
          this.data = listToTree(a);  // 这一句可能不需要
          if (this.data != null && this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
              this.data[i].pid = 0;
            }
          }
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.dialogName.indexOf("新增") != -1) {//添加操作
          /////// 多重调用地狱，需要修改
          // 添加角色入role表
          add(this.form).then(res => {
            if (res.data.errorCode == 200) {
              // 获取新增角色id
              getLast().then(res2 => {
                if (res2.data.errorCode == 200) {
                  this.addedRoleId = res2.data.data.id;
                  // 添加角色对应的权限
                  let pmsIdList = this.$refs.tree.getCheckedKeys()
                  addRPAll({roleId: this.addedRoleId, pmsIdList: pmsIdList}).then(res1 =>{
                    if (res1.data.errorCode == 200) {
                      this.getRoleList();
                    }
                    this.$message.success(res1.data.errorMsg);
                  })
                }
                this.$message.success(res2.data.errorMsg);
              })
              this.$message.success(res.data.errorMsg);
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
          this.dialogFormVisible = false; // 隐藏"新增"弹窗
          // 清空form?
          // 清空keyword?
        } else {//修改操作
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
      }).then(()=>{
        deleteByRoleId(row.id).then(res => {
          if (res.data.errorCode === 200) {
            deleteById(row.id).then(res2 => {
              if (res2.data.errorCode === 200) {
                this.$message.success(res.data.errorMsg);
                this.getRoleList();
              }else{
                this.$message.error(res2.data.errorMsg);
              }
            });
          }else{
            this.$message.error(res.data.errorMsg);
          }
        });
      });
    },
  },

  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.bttns.forEach(function (value, index, array) {
    })
    this.getRoleList();
    /////// 这里获取用户有问题
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
