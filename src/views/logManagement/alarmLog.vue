<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model.trim="param.keyword"
                    placeholder="请输入关键字"
                    maxlength="255"
                    clearable
                    @blur="getAlarmLogList"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item,index) in bttns"
                     :key="index"
                     type="primary"
                     size="mini"
                     :icon="item.icon"
                     v-if="!item.invisible"
                     @click="handleMethod(item.methodd)">{{ item.name }}
          </el-button>
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
    </div>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import {listToTree, copyProperties, setEachPid} from '@/utils';
import Dialog from '@/components/dialog/index';
import selectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getUser} from '@/utils/auth';
import {getAlarmLogList, deleteById, deleteAll, handleAlarmLog} from '@/api/alarmLog'

export default {
  name: "alarmLog",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    let viewOption = (row) =>{
      console.log("sth");
    }
    let handleOption = (row) => {
      console.log("sth");
    }
    let isHandleShow = (row) =>row.status!=='已处理';
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
          text: '报警时间',
          value: 'alarmTime',

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
        dateTo:null,
      },
      tableOption: [
        {
          text: '处理',
          onclick: handleOption,
          isShow: isHandleShow,
        },
        {
          text: '查看',
          onclick: viewOption,
          isShow: ()=>true,
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

    },
    /**
     * 获取报警日志列表
     */
    getAlarmLogList() {
      getAlarmLogList().then(res =>{
        if(res.data.errorCode===200){
          this.data = res.data.data;
        }else{
          this.$message.error("查询失败，请稍后重试")
        }
      }).catch(err=> {
        this.$message.error("查询失败，请稍后重试")
      })
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
  }
}
</script>

<style scoped>

</style>
