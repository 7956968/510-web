<template>
  <div class="content_container">
    <div>
      <el-button v-for="(item,index) in bttns" :key="index" type="primary" size="mini" :icon="item.icon"
                 v-if="!item.invisible"
                 @click="handleMethod(item.methodd)">{{ item.name }}
      </el-button>
      <div style="height: 20px"/>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model.trim="param.keyword"
                    placeholder="请输入关键字"
                    maxlength="255"
                    clearable
                    @blur="getOperationLogList"
                    @keydown.enter.native="getOperationLogList"
          />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="param.dateFrom"
            type="date"
            placeholder="选择日期范围"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @blur="getOperationLogList"
          />
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
      <!-- 页码  -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size.sync="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="changePage"
        @prev-click="changePage"
        @next-click="changePage"
      />
    </div>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import {copyProperties} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {getUser} from '@/utils/auth';
import {getOperationLogList, deleteAll, deleteById} from "@/api/operationLog";

export default {
  name: "operationLog",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let isDeleteShow = (row)=>true;
    let deleteOption = (row)=>{this.delete(row);}
    return {
      bttns: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],           // 表格数据
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 80,
        },
        {
          text: '时间',
          value: 'createTime',

        },
        {
          text: '操作人',
          value: 'userName',
        },
        {
          text: '操作类型',
          value: 'logName',
        },
        {
          text: '状态',
          value: 'succeed',
          width: 80,
          // formatter: (row, column, cellValue, index)=>{return '--'}
        }
      ],
      param: {
        keyword: null,
        dateFrom: null,
        // dateTo:null,
        start: 1, // 页号，从1开始
        length: 10, // 页大小
      },
      // 分页相关
      total: 0, // 总条目数
      pageSize: 10, // 每页显示条目数
      currentPage: 1, // 当前页，从1开始

      tableOption: [
        {
          text: '删除',
          onclick: deleteOption,
          isShow: isDeleteShow,
        },
      ],
    }
  },
  methods: {
    handleMethod(ms) {
      this[ms]();
    },
    search(){
      this.getOperationLogList();
    },
    delete(row) {
      this.$confirm('即将删除操作日志' + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteById(row.id);
      }).then(res => {
        if (res.data.errorCode === 200) {
          this.$message.success("删除成功");
          this.getOperationLogList();
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{});
    },
    deleteAll(){
      let checkedIdList = this.$refs.curTable.getSelectedKeys();
      // 判空
      if( ! checkedIdList.length ){
        this.$message.warning("未勾选数据");
        return ;
      }
      // let checkedRowList = this.$refs.curTable.getSelectedRows(); // 被勾选的列数组
      // let deletedNameList = checkedRowList.map(e=>e.name);  // 待删除列的名字列表
      this.$confirm('即将批量删除操作日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口
        return deleteAll(checkedIdList);
      }).then(res => {
        if(res.data.errorCode === 200){
          this.$message.success("批量删除成功");
          this.getOperationLogList();
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    /**
     * 获取操作日志列表
     */
    getOperationLogList() {
      getOperationLogList(this.param).then(res=>{
        if(res.data.errorCode===200){
          this.total = res.data.data.total;
          this.data = res.data.data.list;
        }else{
         this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{
        this.$message.error("查询失败，请稍后重试")
      })
    },
    // 当前页码改变时，保存改变的页码
    changePage(e){
      this.currentPage = e;
    },
  },
  created() {
    this.bttns = this.$route.meta.btnPermission;
    let that = this;
    this.bttns.forEach(function (item, index, array) {
      if (item.methodd === 'deleteAll'){
        that.canDelete = true;
      }
    })
    this.getOperationLogList();
    this.currentUserId = JSON.parse(getUser()).id;
  },
  watch: {
    currentPage(newVal, oldVal){
      this.param.start=newVal;
      this.param.length=this.pageSize;
      this.getOperationLogList();
    }
  },
}
</script>

<style scoped>

</style>
