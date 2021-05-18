<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model.trim="param.keyword"
                    placeholder="请输入关键字"
                    maxlength="255"
                    clearable
                    @keydown.enter.native="getDictList"
          />
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
    </div>
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center :close-on-click-modal="false">
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="编码" prop="code">
          <el-input v-model.trim="form.code" placeholder="名称" maxlength="50" :readonly="codeReadonly" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="编码" maxlength="50" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="父节点" v-show="isParentShow">
          <selectTree
            style="width: 79%"
            placeholder="请选择"
            ref="selectTree"
            :options="data"
            v-model="form.pid"
            clearable
            accordion="true"
            :normalizer="normalizer"
          />
        </el-form-item>
        <el-form-item label="是否可删除">
          <el-radio-group v-model="form.isDelete">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可修改">
          <el-radio-group v-model="form.isUpdate">
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
import treeTable from '@/components/TreeTable'
import {getDictList, add, updateById, deleteById} from '@/api/dict'
import {listToTree, copyProperties, normalizer} from '@/utils'
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  name: "index",
  components: {
    treeTable,
    Dialog,
    selectTree,
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
      this.isParentShow = false;
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
      codeReadonly: false,
      isParentShow: true,
      options: [],
      labelPosition: 'left',
      ormLabelWidth: '20%',
      bttns: [],
      dialogFormVisible: false,
      dialogName: '新增',
      data: [],
      param:{
        keyword:''
      },
      form: {
        id: null,
        name: '',
        code: '',
        pid: null,
        isDelete: 1,
        isUpdate: 1
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        code: [{required: true, trigger: 'blur', message: "请输入编码"}],
      },
      columns: [
        {
          text: '编码',
          value: 'code',
          width: 250
        },
        {
          text: '名称',
          value: 'name'
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
    normalizer,
    getValue4(id) {
      console.log(id)
      this.form.pid = id.id;
    },
    getDictList() {
      getDictList(this.param).then(re => {
        if (re.data.errorCode == 200) {
          let a = re.data.data;
          this.data = listToTree(a);
          if (this.data != null && this.data.length > 0){
            for (let i = 0; i < this.data.length; i++){
              this.data[i].pid = 0;
            }
          }
          //this.options = re.data.data;
        }
      })
    },
    handleMethod(ms) {
      this[ms]();
    },
    search() {
      this.getDictList();
    },
    add() {
      this.form = {
        name: '',
        code: '',
        pid: null,
        isDelete: 1,
        isUpdate: 1
      }
      this.dialogName = "新增";
      this.isParentShow = true;
      this.codeReadonly = false;
      this.dialogFormVisible = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.form.isDelete = this.form.isDelete == 1 ? true : false;
        this.form.isUpdate = this.form.isUpdate == 1 ? true : false;
        if (this.dialogName.indexOf("新增") != -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode == 200) {
              this.getDictList();
              this.dialogFormVisible = false;
            }
            this.$message.success(res.data.errorMsg);
          })
        } else {//修改操作
          this.form.isDelete = this.form.isDelete == 1 ? true : false;
          this.form.isUpdate = this.form.isUpdate == 1 ? true : false;
          console.log(this.form)
          updateById(this.form).then(res => {
            if (res.data.errorCode == 200) {
              this.getDictList();
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
        return deleteById(row.id);
      }).then(res => {
        if (res.data.errorCode == 200) {
          this.getDictList();
          this.$message.success("删除成功");
        }else {
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err => {})
    },
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.bttns.forEach(function (value, index, array) {})
    this.getDictList();
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
