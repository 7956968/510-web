<!--联动设置：展示两个表，上表设备（报警），下表摄像头-->
<template>
  <div class="content_container">
    <div>
      <el-form label-position="left" :inline="true" :model="param" class="demo-form-inline" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="param.keyword" placeholder="请输入关键字" clearable @blur="getDepartmentList"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button v-for="(item,index) in bttns" :key="liandong" type="primary" size="mini" :icon="item.icon"
                   @click="handleMethod(item.methodd)">{{ item.name }}
        </el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {getUser} from '@/utils/auth';
import {getDeviceList, add, updateById, deleteById,
  getGroupList, addGroup, updateGroupById, deleteAllGroups} from '@/api/device';


export default {
  name: "liandong",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
}
</script>

<style scoped>

</style>
