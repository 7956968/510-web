<template>
  <div class="content_container">
    <div>
      <el-form :label-position="labelPosition" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model.trim="param.keyword"
                    placeholder="请输入关键字"
                    maxlength="255"
                    clearable
                    @blur="getAlarmInfoList"
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
import store from '@/store';
import {getCameraListByAlarmId} from "@/api/device";

export default {
  name: "receiveAlarm",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  data() {
    return{
      bttns: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],           // 表格数据
      columns:[],
      param: { keyword:null },
      tableOption: [],
    }
  },
  methods: {
    handleMethod(ms) {
      this[ms]();
    },
    search(){
      this.getAlarmLogList();
    },
    // 批量删除
    deleteAll(){

    },
    /**
     * 获取报警日志列表
     */
    getAlarmInfoList(){
      console.log("undone");
    },
  },
  created() {
    getCameraListByAlarmId(36).then(res => {
      console.log(res)
    })
  }
}
</script>

<style scoped>

</style>
