<template>
  <div >

    <!--顶栏按钮-->
    <el-form label-position="left" :inline="true" class="demo-form-inline" size="mini" style="">
      <el-form-item>
        <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                   @click="handleMethod(item.methodd)">{{ item.name }}
        </el-button>
      </el-form-item>

    </el-form>

    <!--表格-->
    <tree-table :data="channelData"
                :columns="channelColumns"
                :options="channelOptions"
                border
                ref="channelTable"
                not-tree
    />

    <!--表单-->
    <el-dialog :title="dialogName"
               :visible.sync="formVisible"
               @close=""
               center
               :close-on-click-modal="false"
    >
      <el-form :model="form" size="mini" label-position="left" label-width="100px"
               ref="channelForm"
               :rules="formRules">
        <el-form-item label="设备名">
          <el-input v-model="deviceName" :disabled="true" style="width: auto"/>
        </el-form-item>
        <el-form-item label="通道名" prop="name">
          <el-input v-model="form.name" placeholder="通道名" maxlength="30" style="width: auto"/>
        </el-form-item>
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="序列号" maxlength="30" style="width: auto"/>
        </el-form-item>
        <el-form-item label="通道号" prop="number">
          <el-input v-model.number="form.number" placeholder="通道号" maxlength="11" style="width: auto"/>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="formVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectTree from "@riophae/vue-treeselect";
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {getChannelList, add, updateById, deleteByDeviceId, deleteById, deleteAll} from "@/api/channel";
import {getUser} from '@/utils/auth'

export default {
  name: "channel",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  props: {
    device:{
      type: Object,
      default: null,
    }
  },
  data(){
    let updateOpen = (row) => {
      this.form = JSON.parse(JSON.stringify(row));//解除数据绑定
      this.form.updateUser = this.currentUserId;
      this.form.createUser = null;
      this.dialogName = "修改通道";
      this.formVisible = true;
      // 清除校验结果
      this.$nextTick(()=>{this.$refs["channelForm"].clearValidate();})
    }
    let deleteOption = (row) => {this.delete(row);}
    let isUpdateShow = (row) => {return true;}
    let isDeleteShow = (row) => {return true;}
    return {
      formVisible: false,// 表单可见性
      dialogName: '添加通道',
      deviceName: '--',
      channelData:[],
      channelColumns:[
        {
          text: '通道号',
          value: 'number',
          width: 150,
        },
        {
          text: '通道名',
          value: 'name',
        },
        {
          text: '序列号',
          value: 'serialNumber'
        },
      ],
      channelOptions: [
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
      currentUserId: null, // 登录用户的id
      form:{
        deviceId: null,
        name: '', // 通道名
        serialNumber: null, // 序列号
        createUser: null,
        updateUser: null,
      },
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入通道名"}],
        // serialNumber: [{required: true, trigger: 'blur', message: "请输入序列号"}],
        // number: [
        //   {type: 'number',  trigger: 'blur', message: "必须为数字"},
        //   {required: true, message: "请输入通道号"},
        // ],
      },
      bttns:[
        {
          name:'添加',
          methodd: 'add',
          icon:'el-icon-circle-plus-outline',
          title:'添加',
        },
        {
          name:'刷新',
          methodd: 'getChannelList',
          icon:'el-icon-refresh',
          title:'刷新',
        },
        //// 批量删除
      ],
    }
  },
  methods: {
    handleMethod(ms) {this[ms]();},
    getChannelList(){
      if(this.device==null) return ;
      getChannelList(this.device.id).then(res => {
        if(res.data.errorCode === 200){
          this.channelData = res.data.data;
          // this.$message.success("获取通道列表成功")
        }else {
          this.$message.error(res.data.errorMsg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 展示表单对话框
    add(){
      if(this.device==null){
        this.$message.warning('未选中设备，左键点击以选择')
        return ;
      }
      this.form.deviceId = this.device.id;
      this.form.createUser = this.form.updateUser = this.currentUserId;
      this.formVisible=true;
      this.dialogName="添加通道";
    },
    submitForm(){
      this.$refs.channelForm.validate(valid => {
        if (!valid) return;
        if (this.dialogName.indexOf("添加") !== -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success("添加通道成功");
              this.getChannelList();
            }else{
              this.$message.error(res.data.errorMsg);
            }
          })
          this.formVisible = false; // 隐藏"新增"弹窗
        } else {//修改操作
          updateById(this.form).then(res => {
            if (res.data.errorCode === 200) {
              this.$message.success(res.data.errorMsg);
              this.getChannelList();
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          this.formVisible = false;
        }
      });
    },
    // 删除行数据
    delete(row) {
      this.$confirm('即将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteById(row.id);
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.getChannelList();
          this.$message.success("删除成功");
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{});
    },
    deleteAll(){
      let checkedIdList = this.$refs.channelTable.getSelectedKeys();
      // 判空
      if( ! checkedIdList.length ){
        this.$message.warning("未勾选数据");
        return ;
      }
      let checkedRowList = this.$refs.channelTable.getSelectedRows(); // 被勾选的列数组
      let deletedNameList = checkedRowList.map(e=>e.name);  // 待删除列的名字列表
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
          this.getChannelList()
        } else {
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err => {})
    },
  },
  watch:{
    device(){
      this.deviceName = this.device==null?'--':this.device.name;
      if(this.device==null){this.channelData = [];}
      else this.getChannelList()
    },
  },
  created() {
    this.currentUserId = JSON.parse(getUser()).id;
  }
}
</script>

<style scoped>

</style>
