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
        <el-form-item label="描述" prop="name">
          <el-input v-model="form.name" placeholder="描述" style="width: auto"></el-input>
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
import dictType from '@/components/type';
import {getDeptList, add, updateById, deleteById} from '@/api/department';
import {listToTree, copyProperties} from '@/utils';

export default {
  name: "department",
  components: {
    Dialog,
    treeTable,
  },
  data() {
    return {
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        description: [{required: true, trigger: 'blur', message: "请输入描述"}],
        //// 待补充
      },
      param:{
        // 查询的关键字
        keyword:''
      },
      form: {
        id: null,
        name: '',
        description: '',
        createTime: '',
        ////待补充
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
        /// 待补充
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
    getDeptList() {
      getDeptList(this.param).then(res => {
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
    delete(row) {
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(res => {
          if (res.data.errorCode == 200) {
            this.getDeptList();
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
    this.getDeptList();
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
