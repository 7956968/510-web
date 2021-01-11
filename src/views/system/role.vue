<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getRoleList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns"
                     :key="index"
                     type="primary"
                     size="mini"
                     :icon="item.icon"
                     v-if="!item.invisible"
                     @click="handleMethod(item.methodd)">{{ item.name }}
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
                  option-column-width="165"
      />
    </div>

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center :close-on-click-modal="false">
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
            :data="permissionList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            :props="defaultProps"
            empty-text="无任何权限"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看权限" :visible.sync="viewVisible" @close="" center>
      <el-tree
        :data="permissionList"
        default-expand-all
        node-key="id"
        ref="treeview"
        :filter-node-method="filterViewNode"
        :props="defaultProps"
        empty-text="无任何权限"
      />
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import {getRoleList, add, addWithPermissions, updateById, deleteById, deleteAll, getLast} from '@/api/role';
import {getPermissionListByRoleId, addAll as addRPAll, deleteAll as deleteRPAll, deleteByRoleId, getPmsIdListByRoleId} from '@/api/rolePermission';
import {listToTree, copyProperties, setEachPidZero} from '@/utils';
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
      // this.setDisabled(this.permissionList)
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.dialogName = "修改";
      this.dialogFormVisible = true;
      // 设置已有权限, 并设置为勾选状态
      getPmsIdListByRoleId(row.id)
        .then(res=>{
          if (res.data.errorCode == 200) {
            this.chosenRowPmsIdList = res.data.data
            // this.$refs.tree.setCheckedKeys(this.chosenRowPmsIdList)
            // 设置勾选
            this.setCheckedAll(this.permissionList);

            this.$message.success(res.data.errorMsg);
          }else{
            return Promise.reject('获取选中角色权限失败')
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    }
    /**
     * 查看某行的权限
     * @param row
     */
    let viewOptions = (row) => {
      getPmsIdListByRoleId(row.id)
        .then(res=>{
          if (res.data.errorCode == 200) {
            this.chosenRowPmsIdList = res.data.data
            this.viewVisible = true
            this.$message.success(res.data.errorMsg);
          }else{
            return Promise.reject('获取选中角色权限失败')
          }
        })
        .catch(err => {
          console.log(err)
        })

    }
    let deleteOption = (row) => {
      this.delete(row);
    }
    let isUpdateShow = (row) => (row.changeable && this.canUpdate);
    let isDeleteShow = (row) => (row.deleteable && this.canDelete);
    return {
      canDelete: false,
      canUpdate: false,

      bttns: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      viewVisible: false,       // 查看权限窗口的可见性
      dialogName: '新增', // 弹窗名
      data: [],           // 表格数据
      currentRoleId: null,  // 当前登录角色id
      permissionList: [],   // 当前登录角色所拥有的权限列表
      addedRoleId: null,    // 新增角色的id
      curRolePmsIdList: [],    // 当前登录角色的id权限列表
      chosenRowPmsIdList: [],   // 选中列的权限id列表


      defaultProps:{  // el-tree的props
        label: 'title',   // 权限列表的title作为展示文字
      },
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
          text: '序号',
          value: 'id',
          width: 120,
        },
        {
          text: '名称',
          value: 'name',
          width: 200,
        },
        {
          text: '描述',
          value: 'description'
        },
        {
          text: '创建时间',
          value: 'createTime',
          width: 180,
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
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
      // 获取当前角色的权限列表, 提供给“新建角色”的表单
      this.getMyPermissionList()
    },
    /**
     * 获取当前登录角色权限列表
     */
    getMyPermissionList() {
      getPermissionListByRoleId(this.currentRoleId).then(res =>{
        if (res.data.errorCode == 200) {
          // this.$message.success(res.data.errorMsg);
          //// 在这里写pmsIdList为map(e=>e.id)方法获取

          // 数组转树
          this.permissionList = listToTree(res.data.data);
        }else{
          this.$message.error(res.data.errorMsg);
        }
      });
      getPmsIdListByRoleId(this.currentRoleId).then(res =>{
        if (res.data.errorCode == 200) {
          this.$message.success(res.data.errorMsg);
          this.curRolePmsIdList = res.data.data;
        }else{
          this.$message.error(res.data.errorMsg);
        }
      });
    },
    // 将已有权限勾选
    getChosenRowPmsIdList(roleId){
      getPmsIdListByRoleId(roleId)
        .then(res=>{
          if (res.data.errorCode == 200) {
            this.chosenRowPmsIdList = res.data.data
            this.$message.success(res.data.errorMsg);
          }else{
            return Promise.reject('获取选中角色权限失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    setCheckedAll(arr){
      for (let i = 0; i < arr.length; i++) {
        this.$refs.tree.setChecked(arr[i].id, this.chosenRowPmsIdList.includes(arr[i].id), false)
        if (arr[i].children && arr[i].children.length > 0) {
          this.setCheckedAll(arr[i].children)
        }
      }
    },
    /**
     * 设置权限表中的部分数据不可被勾选
     * @param arr
     */
    // setDisabled(arr) {
    //   ////// pmdlist作为不可被选中的元素
    //   let pmdlist = [2,4,5];
    //   for (let i = 0; i < arr.length; i++) {
    //     arr[i]['disabled'] = pmdlist.includes(arr[i].id)
    //     if (arr[i].children && arr[i].children.length > 0) {
    //       this.setDisabled(arr[i].children)
    //     }
    //   }
    // },
    /**
     * 过滤权限节点，用于查看权限功能
     * @param value
     * @param data
     * @returns {boolean}
     */
    filterViewNode(value, data) {
      if (!value) return true;
      return this.chosenRowPmsIdList.includes(data.id);
    },
    getRoleList() {
      getRoleList(this.param).then(res => {
        if (res.data.errorCode == 200) {
          this.data = res.data.data;
          setEachPidZero(this.data);
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        // 获取勾选列表
        let chsIdList = this.$refs.tree.getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys());

        if (this.dialogName.indexOf("新增") !== -1) {//添加操作

          // add(this.form).then(res => {
          //   if (res.data.errorCode === 200) {
          //     // 获取新增角色id
          //     return getLast()
          //   }else return Promise.reject(res.data.errorMsg);
          // }).then(res2 => {
          //   if (res2.data.errorCode === 200) {
          //     this.addedRoleId = res2.data.data.id;
          //
          //     return addRPAll({roleId: this.addedRoleId, pmsIdList: chsIdList});
          //   }else return Promise.reject(res2.data.errorMsg);
          // }).then(res3 => {
          //   if (res3.data.errorCode === 200) {
          //     this.$message.success("角色添加成功");
          //     this.getRoleList();
          //   }else return Promise.reject(res3.data.errorMsg);
          // }).catch(err => {
          //   console.log(err)
          //   this.$message.error(err);
          // })


          // 添加角色并添加权限
          addWithPermissions(this.form, chsIdList).then(res => {
            if(res.data.errorCode === 200) {

            }else {
              this.$message.error(res.data.errorMsg)
            }
          }).catch(err => {})

          this.dialogFormVisible = false; // 隐藏"新增"弹窗
          //// 清空form?
          //// 清空keyword?
        } else {//修改操作


          // 先删除所有权限，再增加权限
          // deleteByRoleId(this.form.id)
          // .then(res => {
          //   if(res.data.errorCode === 200){
          //     if(chsIdList.length!==0) {
          //       return addRPAll({roleId: this.form.id, pmsIdList: chsIdList})
          //     }else return {data:{errorCode: 200}}
          //   }else return Promise.reject(res.data.errorMsg);
          // }).then(res2 => {
          //   if(res2.data.errorCode === 200){
          //     this.$message.success("修改角色成功")
          //     this.getRoleList()
          //   }else return Promise.reject(res.data.errorMsg);
          // }).catch(err => {
          //   this.$message.error(err)
          // })

          // 更新名字和描述
          updateById(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.getRoleList();
              this.$message.success(res.data.errorMsg);
            }else {
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
          this.getRoleList()
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{})
    },
  },
  watch: {
    viewVisible(val){
      if(val){
        this.$nextTick(()=>{this.$refs["treeview"].filter("view")})
      }
    }
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
    this.getRoleList();
    /////// 这里获取用户有问题
    this.currentRoleId = JSON.parse(getUser()).roleId;

    this.getMyPermissionList();
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
