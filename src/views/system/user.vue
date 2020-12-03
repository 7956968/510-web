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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="性别">-->
          <el-radio-group v-model="form.">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import {getUserList, add, updateById, deleteById} from '@/api/user';
import {listToTree, copyProperties} from '@/utils';
import Dialog from '@/components/dialog/index';
import dictType from '@/components/type';

export default {
  name: "user",
  components:{
    Dialog,
    treeTable,
  },
  data() {
    let updateOpen = (row) => {
      delete row.children;
      row.pid = null;
      // this.form = copyProperties(row,this.form);
      // console.log(this.form);
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      //this.form.pid = null;
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
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        gender: [{required: true, trigger: 'blur', message: "请选择性别"}],
        jobNumber: [{required: true, trigger: 'blur', message: "请输入工号"}],
        career: [{required: true, trigger: 'blur', message: "请输入职位"}],
        role: [{required: true, trigger: 'blur', message: "请输入角色"}],
        phone: [{required: true, trigger: 'blur', message: "请输入手机号"}],
      },
      param:{
        // 检索用的关键字
        keyword:''
      },
      form: {
        id: null,
        name: '',

        createTime: '',
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
          value: 'career'
        },
        {
          text: '角色',
          value: 'role'
        },
        {
          text: '手机号',
          value: 'phone'
        },
        {
          text: '状态',
          value: 'state'
        },
      ],
      tableOption: [
        {
          text: '修改',
          onclick: updateOpen,
          isShow: isUpdateShow,
        },
        // {
        //   text: '删除',
        //   onclick: deleteOption,
        //   isShow: isDeleteShow,
        // }
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
        name: '',

        /////  待补充
      };
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    getUserList() {
      getUserList(this.param).then(res => {
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
              this.getUserList();
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
              this.getUserList();
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
            this.getUserList();
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
  },
}
</script>

<style scoped>

</style>
