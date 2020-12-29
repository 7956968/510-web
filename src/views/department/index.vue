<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getDepartmentList"></el-input>
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

    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center >
      <el-form :model="form"
               ref="dialogForm"
               :rules="formRules"
               :label-position="labelPosition"
               label-width="100px"
               size="mini">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="名称" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="form.description" placeholder="描述" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="父部门" prop="pid">
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
import {getDepartmentList, add, updateById, deleteById} from '@/api/department';
import {listToTree, copyProperties, normalizer} from '@/utils';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'


export default {
  name: "index",
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
    let validatePid = (rule, value, callback) => {
      if (value && value===this.form.id) {
        callback(new Error('父部门不可以是它自己'));
      }else {
        callback();
      }
    };
    return {
      data: [],
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      currentUserId: null,    // 当前用户id
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        description: [{required: true, trigger: 'blur', message: "请输入描述"}],
        pid: [{validator: validatePid, trigger: 'blur', }]
      },
      param:{
        // 查询的关键字
        keyword:''
      },
      form: {
        id: null,
        name: '',
        pid: null,  // 父部门的id
        description: '',
        createUser: null,
        updateUser: this.currentUserId,
      },
      columns: [
        {
          text: '名称',
          value: 'name',
          align: 'left'
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
    normalizer(node) {
      return normalizer(node)
    },
    handleMethod(ms) {
      this[ms]();
    },
    // 处理勾选项
    handleSelectionChange(val){
      console.log(val)
    },
    add() {
      this.form = {
        id: null,
        name: '',
        pid: null,
        description: '',
        createUser: this.currentUserId,
        updateUser: this.currentUserId
      };
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["dialogForm"].clearValidate();})
    },
    search() {
      this.getDepartmentList();
    },
    getDepartmentList() {
      getDepartmentList(this.param).then(res => {
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
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.dialogName.indexOf("新增") !== -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success(res.data.errorMsg);
              this.getDepartmentList()
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
              this.getDepartmentList();
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
            this.getDepartmentList();
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
    this.getDepartmentList();
    this.currentUserId = JSON.parse(getUser()).id;
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
