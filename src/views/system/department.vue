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
        <el-form-item label="父节点">
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
import {listToTree, copyProperties} from '@/utils';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  name: "department",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    return {
      data: [],
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名

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
        pid: null,  // 父部门的id
        createTime: '',
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
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    handleMethod(ms) {
      this[ms]();
    },
    getDepartmentList() {
      getDepartList(this.param).then(res => {
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
            this.getDepartList();
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
    this.getDepartmentList();
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
