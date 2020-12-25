<template>
  <tree-table :data="channelData" :columns="channelColumns" :options="channelOptions" border ref="channelTable"/>
</template>

<script>
import selectTree from "@riophae/vue-treeselect";
import treeTable from '@/components/TreeTable';
import Dialog from '@/components/dialog/index';
import {listToTree, copyProperties, setEachPidZero, setNotLeafDisabled, normalizer} from '@/utils';
import {getChannelList} from "@/api/channel";

export default {
  name: "channel",
  components: {
    Dialog,
    treeTable,
    selectTree
  },
  props: {
    deviceId:{

    }
  },
  data(){
    return {
      channelData:[],
      channelColumns:[
        {
          text: '通道号',
          value: 'number'
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
      channelOptions:[],
    }
  },
  methods: {
    getChannelList(){
      // 参数待修改
      // getChannelList(this.deviceId).then(res => {
      //   if(res.data.errorCode === 200){
      //     this.$message.success("获取通道列表成功")
      //   }else {
      //     this.$message.error(res.data.errorMsg)
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
    },
  },
  watch:{
    deviceId(){
      this.getChannelList()
    }
  }
}
</script>

<style scoped>

</style>
