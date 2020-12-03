<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
    <el-table-column v-if="columns.length===0" >
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width" header-align="center" align="center">
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>

        <el-checkbox v-if="index === 0"  v-model="scope.row._checked" @change="checked=>handleChecked(checked,scope.row)"> </el-checkbox>
        {{ scope.row[column.value] || "--"}}
      </template>
    </el-table-column>

    <el-table-column label="操作" header-align="center" align="center">
      <template slot-scope="scope">
        <!--操作按钮区域-->
        <el-button type="text"   v-for="option in options" :key="option.text" v-show="option.isShow(scope.row)" @click="option.onclick(scope.row)">{{option.text}}</el-button>

      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>

import treeToArray from './eval'
export default {
  name: 'TreeTable',
  created(){
  },
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    options:Array,
  },
  watch: {

  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {

    showRow: function(row) {
      const show = (row.row.pid ? (row.row.pid._expanded && row.row.pid._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    // handleChecked(checked,row){
    //   this.onSelect(checked,row,true);
    // },
    handleChecked(checked,row){//
      if(row.children && row.children.length > 0){
        let children = row.children
        for(let i = 0 ;i < children.length;i++){
          children[i]._checked = checked;
          this.handleChecked(checked,children[i]);
        }
      }else{
        row._checked = checked;
        return;

      }
    },
  }
}
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {opacity: 0;}
  to {opacity: 1;}
}
@-webkit-keyframes treeTableShow {
  from {opacity: 0;}
  to {opacity: 1;}
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196F3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: ""
  }
}
.processContainer{
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl{
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
