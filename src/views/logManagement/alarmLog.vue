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
                    @blur="getAlarmLogList"
                    @keydown.enter.native="getAlarmLogList"
          />
        </el-form-item>
        <el-form-item label="状态">
          <!-- 失去焦点触发可以添加属性@blur="getAlarmLogList"-->
          <el-select v-model.trim="param.status"
                     placeholder="请选择处理状态"
                     clearable
                     @blur="getAlarmLogList"
          >
            <el-option
              v-for="(item,idx) in statusOptions"
              :key="item.index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="param.dateFrom"
            type="date"
            placeholder="选择日期范围"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @blur="getAlarmLogList"
          />
        </el-form-item>
      </el-form>
    </div>

    <!--  表格  -->
    <div>
      <tree-table :data="data"
                  :columns="columns"
                  :options="tableOption"
                  border
                  not-tree
                  ref="curTable"
                  option-column-width="100"
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

    <!--  填写处理信息的对话框  -->
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" @close="" center :close-on-click-modal="false">
      <el-form :model="form" ref="dialogForm" :rules="formRules" :label-position="labelPosition" label-width="100px"
               size="mini">
        <el-form-item label="处理人" prop="name">
          <el-input v-model.trim="currentUserName" :disabled="true" placeholder="处理人" maxlength="30" style="width: auto"/>
        </el-form-item>
        <el-form-item label="处理类型" prop="type">
          <el-input v-model.trim="form.type" placeholder="处理类型" maxlength="50" style="width: auto"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="form.description"
                    type="textarea"
                    placeholder="描述"
                    maxlength="255"
                    :autosize="{ minRows: 2 }"
                    style="width: auto"/>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  填写处理信息的对话框  -->
    <el-dialog title="报警处理结果" :visible.sync="dialogFormVisible2" @close="" center :close-on-click-modal="false">
      <div>
        <div><span>处理人：</span><span>{{ (alarmHandleLog&&alarmHandleLog.userName) || '--' }}</span></div>
        <div><span>处理类型：</span><span>{{ (alarmHandleLog&&alarmHandleLog.type) || '--' }}</span></div>
        <div><span>处理描述：</span><span>{{ (alarmHandleLog&&alarmHandleLog.description) || '--' }}</span></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import {listToTree, copyProperties, setEachPid} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {getUser} from '@/utils/auth';
import {getAlarmLogList, deleteById, deleteAll, addAlarmHandleLog, selectAlarmHandleLogById} from '@/api/alarmLog';

export default {
  name: "alarmLog",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let viewOption = (row) =>{
      if(!row.handleId){
        this.$message.warning("此报警日志未被处理");
        return ;
      }
      selectAlarmHandleLogById(row.handleId).then(res => {
        if(res.data.errorCode===200){
          this.alarmHandleLog = res.data.data;
          this.dialogFormVisible2 = true;
        }else{
          this.$message.error("获取处理日志失败，请稍后尝试");
        }
      }).catch(err => {
        this.$message.error("获取处理日志失败，请稍后尝试");
        console.log(err);
      })
    }
    let handleOption = (row) => {
      this.form.userId = this.currentUserId;
      this.chosenRowsIdList = [row.id];
      this.dialogFormVisible = true;
    }
    let isHandleShow = (row) =>row.status!=='已处理';
    // let isViewShow = (row)=>true;
    let isViewShow = (row)=>row.status==='已处理';
    return {
      currentUserId: null,
      currentUserName: '',
      bttns: [],
      labelPosition: 'left',
      dialogFormVisible: false, // ”处理报警日志“弹窗不可见
      dialogFormVisible2: false, // ”查看处理结果“弹窗不可见
      dialogName: '处理报警日志', // 弹窗名
      data: [],           // 表格数据
      // 报警处理日志（用于“查看处理结果”）
      alarmHandleLog: null,
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 80,
        },
        {
          text: '报警时间',
          value: 'alarmTime',
          sortable: true,
        },
        {
          text: '报警主机',
          value: 'name',
        },
        {
          text: '描述',
          value: 'description',
        },
        {
          text: '状态',
          value: 'status',
          // formatter: val=>val===1?'已处理':'未处理',
          // formatter: (row, column, cellValue, index)=>{return '--'}
        }
      ],
      param: {
        keyword: '',
        status: null,
        dateFrom:null,
        // dateTo:null,
        start: 1, // 页号，从1开始
        length: 10, // 页大小
      },
      // 分页相关
      total: 0, // 总条目数
      pageSize: 10, // 每页显示条目数
      currentPage: 1, // 当前页，从1开始
      // 选中的数据行（用于处理（handleOption）和批量处理两个操作）
      chosenRowsIdList: [],
      // 报警处理表单
      form: {
        id: null,
        userId: null,
        type: null,
        description: null,
        createTime: null,
        // alarmLogId: null,
      },
      formRules: {
        // type: [{required: true, trigger: 'blur', message: "请填写处理类型"}],
        description: [{required: true, trigger: 'blur', message: "请填写描述"}],
      },
      // 日志状态选择
      statusOptions: [
        {
          value: 0,
          text:'未处理',
        },
        {
          value: 1,
          text:'已处理',
        },
      ],
      tableOption: [
        {
          text: '处理',
          onclick: handleOption,
          isShow: isHandleShow,
        },
        {
          text: '查看',
          onclick: viewOption,
          isShow: isViewShow,
        },
        // {
        //   text: '删除',
        //   onclick: deleteOption,
        //   isShow: isDeleteShow,
        // },
      ],
    }
  },
  methods: {
    handleMethod(ms) {
      this[ms]();
    },
    search(){
      this.getAlarmLogList();
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
      this.$confirm('即将删除报警日志 [' + deletedNameList + '] 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口
        return deleteAll(checkedIdList);
      }).then(res => {
        if(res.data.errorCode === 200){
          this.$message.success("批量删除成功");
          this.getAlarmLogList()
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    /**
     * 获取报警日志列表
     */
    getAlarmLogList() {
      getAlarmLogList(this.param).then(res =>{
        if(res.data.errorCode===200){
          this.total = res.data.data.total;
          this.data = res.data.data.list;
        }else{
          this.$message.error(res.data.errorMsg);
        }
      }).catch(err=> {
        this.$message.error("查询失败，请稍后重试")
      })
    },
    // 批量处理报警日志（显示”处理“对话框）
    handleAll(){
      this.chosenRowsIdList = this.$refs.curTable.getSelectedKeys();
      // 判空
      if( ! this.chosenRowsIdList.length ){
        this.$message.warning("未勾选数据");
        return ;
      }
      this.form.userId = this.currentUserId;
      this.dialogFormVisible = true;
    },
    // 提交”处理“表单
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {return;}

        addAlarmHandleLog(this.chosenRowsIdList, this.form).then(res=> {
          if(res.data.errorCode===200){
            this.$message.success("添加处理信息成功");
            this.getAlarmLogList();
            this.dialogFormVisible = false; // 隐藏”处理“窗口
          }else{
            this.$message.error(res.data.errorMsg);
          }
        }).catch(err => {
          console.log(err)
        });
      });
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
    this.getAlarmLogList();
    this.currentUserId = JSON.parse(getUser()).id;
    this.currentUserName = JSON.parse(getUser()).name;
  },
  watch: {
    currentPage(newVal, oldVal){
      this.param.start=newVal;
      this.param.length=this.pageSize;
      this.getAlarmLogList();
    }
  },
}
</script>

<style scoped>

</style>
