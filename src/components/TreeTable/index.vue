<template>
  <el-table :data="formatData"
            :row-style="showRow"
            v-bind="$attrs"
            @select="handleSelect"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            :highlight-current-row="highlightCurrentRow"
  >
    <!-- 让勾选框不在第一个字段内部而是自己独立一列-->
    <el-table-column
      type="selection"
      width="42"
      :selectable='rowSelectable'
    />

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
<!--    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width" header-align="center" align="center">-->
    <!--  没有prop无法使用filter  -->
    <el-table-column v-else
                     v-for="(column, index) in columns"
                     :key="column.value"
                     :label="column.text"
                     :width="column.width"
                     :filter-method="column.filterMethod"
                     :filters="column.filters"
                     :prop="column.value"
    >
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <!--树层级越大，缩进越多-->
        <span v-for="space in scope.row._level" v-if="index===0&&!notTree" :key="space" class="ms-tree-space"/>
        <!--展开/收缩 符号-->
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        <!-- 第一个字段内部的勾选框-->
        <!--  <el-checkbox v-if="index === 0"  v-model="scope.row._checked" @change="checked=>handleChecked(checked,scope.row)"> </el-checkbox>-->
        {{ scope.row[column.value] || "--"}}
      </template>
    </el-table-column>

<!--    <el-table-column label="操作" header-align="center" align="center">-->
    <el-table-column label="操作" :width="OptionColumnWidth">
      <template slot-scope="scope">
        <!--操作按钮区域-->
        <el-button type="text"
                   v-for="option in options"
                   :key="option.text"
                   v-show="option.isShow(scope.row)"
                   @click.stop.prevent="option.onclick(scope.row)">
          {{option.text}}
        </el-button>

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
    data: { // 放入表格的具体数据
      type: [Array, Object],
      required: true
    },
    columns: { // 列字段名
      type: Array,
      default: () => [],
      // [{
      //  value: 值,
      //  text: 显示的文本,
      //  width: 列宽度,
      //  filterMethod(value, row, column): 过滤方法, value是目标值(比如关键词), row是待筛选数据行, column是列对象
      //  filters: 过滤选项数组
      // }, {}, ... ]
    },
    evalFunc: Function,
    evalArgs: Array,
    notTree: { // 为true = 非树表（也就是普通的表）
      type: Boolean,
      default: false
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    options:Array,
    handleRowClick: { // 点击行触发函数
      type:Function,
      default: () => {},
    },
    // 设置表格的勾选框是否可以勾选
    // row 列对象
    // rowIndex 列索引
    // @return true: 可勾选
    rowSelectable:{
      type: Function,
      default: (row, rowIndex) => {
        return !row.children || row.children.length === 0;
      },
    },
    highlightCurrentRow: { // 高亮选中行
      type: Boolean,
      default: false,
    },
    OptionColumnWidth: { // 操作列的宽度
      default: 100,// 2个操作为100
      //// 三字段是165
    }
  },
  data() {
    return {
      multipleSelection: [],
    }
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
    // 展开/收缩图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    // handleChecked(checked,row){
    //   this.onSelect(checked,row,true);
    // },
    // 点击第一个字段内的勾选框触发(暂时不使用)
    handleChecked(checked,row){
      if(row.children && row.children.length > 0){
        let children = row.children
        for(let i = 0 ;i < children.length;i++){
          children[i]._checked = checked;
          this.handleChecked(checked,children[i]);
        }
      }else{
        row._checked = checked;
      }
    },
    /**
     *  点击最前面的勾选框触发的事件
     * @param val 所有的勾选项组成的数组
     * @param row 最近一次被勾选的列
     */
    handleSelect(val, row){
      // console.log(val)
      // console.log(row)
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    // 获取勾选的列数组
    getSelectedRows(){
      return this.multipleSelection;
    },
    // 获取勾选的列的id
    getSelectedKeys(){
      return this.multipleSelection.map((e) => e.id)
    },
    // 获取勾选的节点列表
    // getCheckedNodes(){
    //   let res = [];
    //   res = this.data.filter(item=>item._checked)
    //   return res
    // },
    // 获取勾选的节点的key列表, 属性是id, 待修改
    // getCheckedKeys(){
    //   let res = [];
    //   this.data.forEach(item => {
    //     if(item._checked){
    //       res.push(item.id)
    //     }
    //   })
    //   return res
    // },
    // 让勾选框不在第0列内部而是自己独立一列
    // handleSelectionChange(val){
    //   console.log(val)
    // }
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
  /*如果有展开符号，向左缩进*/
  margin-left: -$space-width;
}
</style>

<!--修改选中行的高亮色，不能放在有scoped属性的style标签中-->
<style>
.el-table__body tr.current-row>td{
  background-color: #a7bd81 !important;
  color: #fff;
}
</style>
