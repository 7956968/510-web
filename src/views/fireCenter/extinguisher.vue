<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model.trim="param.keyword"
                    placeholder="请输入关键字"
                    maxlength="255"
                    clearable
                    @blur="getExtinguisherList"
          />
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
          <el-input v-model.trim="form.name" placeholder="名称" maxlength="30" style="width: auto"/>
        </el-form-item>
        <el-form-item label="位置" prop="description">
          <el-input v-model.trim="form.location" placeholder="位置" maxlength="100" style="width: auto"/>
        </el-form-item>
        <el-form-item label="到期时间" prop="expirationTime">
          <el-input v-model.trim="form.expirationTime" placeholder="到期时间" style="width: auto"/>
        </el-form-item>
        <el-form-item label="巡检周期" prop="inspectionCycle">
          <el-input v-model.number="form.inspectionCycle" placeholder="巡检周期" maxlength="10" style="width: auto"/>
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
import {getExtinguisherList, add, updateById, deleteById, deleteAll} from '@/api/extinguisher';
import {listToTree, copyProperties, setEachPid} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'

export default {
  name: "extinguisher",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.dialogName = "修改";
      this.dialogFormVisible = true;

      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
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
      dialogName: '新增', // 弹窗名
      data: [],           // 表格数据

      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        location: [{required: true, trigger: 'blur', message: "请输入位置"}],
        expirationTime: [{required: true, trigger: 'blur', message: "请输入到期时间"}],
        status: [{required: true, trigger: 'blur', message: "请选择状态"}],
        inspectionCycle: [{required: true, trigger: 'blur', message: "请输入巡检周期"}],
      },
      param:{
        // 查询的关键字
        keyword: ''
      },
      form: {
        id: null,
        name: '',
        location: '',
        expirationTime: '',
        status: '',
        inspectionCycle: '',
        createUser: null,
        updateUser: null,
      },
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 120,
        },
        {
          text: '位置',
          value: 'location',
        },
        {
          text: '到期时间',
          value: 'expirationTime',
        },
        {
          text: '状态',
          value: 'status',
          width: 120,
        },
        {
          text: '巡检周期',
          value: 'inspectionCycle',
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
      this.getExtinguisherList();
    },
    // 显示新增表单
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
    getExtinguisherList() {
      getExtinguisherList(this.param).then(res => {
        if (res.data.errorCode === 200) {
          this.data = res.data.data;
          setEachPid(this.data, 0);
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }

        if (this.dialogName.indexOf("新增") !== -1) {//添加操作

          this.dialogFormVisible = false; // 隐藏"新增"弹窗
          //// 清空keyword?
        } else {//修改操作

          updateById(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.getExtinguisherList();
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
        return deleteById(row.id);
      }).then(res => {
        if(res.data.errorCode === 200) {
          this.$message.success("删除成功");
          this.getExtinguisherList();
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err =>{
        console.log(err);
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
          this.getExtinguisherList()
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{})
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
    this.getExtinguisherList();

    this.currentUserId = JSON.parse(getUser()).id;
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
