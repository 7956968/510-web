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
        <el-form-item label="厂家" prop="manufacturers">
          <el-input v-model="form.manufacturers" placeholder="厂家" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="序列号" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select
            placeholder="请选择"
            v-model="form.type"
            filterable
            allow-create
            style="width: 79%">
            <el-option
              v-for="(item,idx) in deviceTypeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" style="width: auto"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="prot">
          <el-input v-model="form.prot" placeholder="请输入端口号" style="width: auto"></el-input>
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
import {listToTree} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth'

export default {
name: "device",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let updateOpen = (row) => {
      delete row.children;
      row.pid = null;
      this.form = JSON.parse(JSON.stringify(row));// 解除数据绑定
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
      return true;
    }
    return {
      bttns: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],   // 展示的表格数据
      currentRoleId: null,  // 当前登录角色id
      deviceTypeOptions: ['摄像头', '报警设备'],
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入名称"}],
        /////
      },
      param:{
        keyword:'',   // 关键字
        groupId:null, // 组id

      },
      form: {
        id: null,
        manufacturers: '',   // 厂家
        name: '',
        serialNumber: '', // 序列号
        type: '',
        ip: '',
        prot: '',
      },
      columns: [
        {
          text: '序号',
          value: 'id'
        },
        {
          text: '厂家',
          value: 'manufacturers'
        },
        {
          text: '设备名称',
          value: 'name'
        },
        {
          text: '设备类型',
          value: 'type'
        },
        {
          text: 'IP',
          value: 'ip'
        },
        {
          text: '端口',
          value: 'prot'
        },
        {
          text: '序列号',
          value: 'serialNumber'
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
      this.getDeviceList();
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

    getDeviceList() {
      getDeviceList(this.param).then(res => {
        if (res.data.errorCode == 200) {
          let a = res.data.data;
          this.data = listToTree(a);
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
          add(this.form).then(res => {
            if (res.data.errorCode == 200) {
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
              this.getDeviceList();
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
        // 删除设备，删除分组，删除通道
      });
    },
  },

  created() {
    this.bttns = this.$route.meta.btnPermission;
    this.bttns.forEach(function (value, index, array) {})
    this.getDeviceList();
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
