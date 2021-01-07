<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getCarList"></el-input>
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
                  @selection-change="handleSelectionChange"
                  not-tree
                  ref="curTable"
      />
    </div>

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center :close-on-click-modal="false">
      <el-form :model="form"
               ref="dialogForm"
               :rules="formRules"
               :label-position="labelPosition"
               label-width="100px"
               size="mini">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="描述" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="父部门">
          <selectTree
            style="width: 79%"
            placeholder="请选择"
            ref="selectTreeDept"
            :options="data"
            v-model="form.pid"
            clearable
            accordion="true"
            :defaultExpandLevel=4
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
import Dialog from '@/components/dialog/index';
// import {getCarList, add, updateById, deleteById, deleteAll} from '@/api/department';
import {listToTree} from '@/utils';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "car",
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
      this.$nextTick(() => {
        this.$refs["dialogForm"].clearValidate();
      })
    }
    let deleteOption = (row) => {
      this.delete(row);
    }
    let isUpdateShow = (row) => {
      return true;
    }
    let isDeleteShow = (row) => {
      return true;
    }
    return {
      data: [],
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      formRules: {
        // name: [{required: true, trigger: 'blur', message: "请输入名称"}],
      },
      param:{
        // 查询的关键字
        keyword:''
      },
      // form: {}
      columns: [
        {
          text: '车牌号',
          value: 'carNumber',
        },
        {
          text: '使用单位',
          value: 'phone'
        },
        {
          text: '司机姓名',
          value: 'carUser'
        },
        {
          text: '司机电话',
          value: 'phone'
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
    handleMethod(ms) {
      this[ms]();
    },
    // 处理勾选项
    handleSelectionChange(val){
      console.log(val)
    },
    //// add() {}
    search(){ // 查询
      this.getCarList();
    },
    getCarList(){
      getCarList(this.param).then(res => {
        console.log("write sth")
      })
    },
    //// submitForm() {}
    delete(row) {
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteById(row.id);
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.getCarList();
          this.$message.success("删除成功");
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err => {});
    },
    deleteAll() {
      let checkedIdList = this.$refs.curTable.getSelectedKeys();
      // 判空
      if (!checkedIdList.length) {
        this.$message.warning("未勾选数据");
        return;
      }
      let checkedRowList = this.$refs.curTable.getSelectedRows(); // 被勾选的列数组
      let deletedNameList = checkedRowList.map(e=>e.carNumber);  // 待删除列的名字列表
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
          this.getCarList()
        } else {
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err => {})
    }
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    // this.bttns.forEach(function (value, index, array) {})
    this.getCarList();
  },
}
</script>

<style scoped>

</style>
