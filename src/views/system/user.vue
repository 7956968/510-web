<template>

</template>

<script>
import treeTable from '@/components/TreeTable';
import {getUserList, add, updateById, deleteById} from '@/api/user';
import {listToTree, copyProperties} from '@/utils';
import Dialog from '@/components/dialog/index';
import dictType from '@/components/type';

export default {
  name: "user",
  components:{
    Dialog,
    treeTable,
  },
  data() {
    return {
      bttns: [],
      options: [],
      labelPosition: 'left',
      dialogFormVisible: false, // 弹窗不可见
      dialogName: '新增', // 弹窗名
      data: [],
      formRules: {
        name: [{required: true, trigger: 'blur', message: "请输入姓名"}],
        description: [{required: true, trigger: 'blur', message: "请选择性别"}],
        //////待补充
      },
      param:{
        // 检索用的关键字
        keyword:''
      },
      form: {
        id: null,
        name: '',

        createTime: '',
      },
      columns: [
        {
          text: '姓名',
          value: 'name'
        },
        {
          text: '创建时间',
          value: 'createTime'
        },
      ],
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
    add() {
      this.form = {
        name: '',

        /////  待补充
      };
      this.dialogName = "新增";
      this.dialogFormVisible = true;
      this.$refs.dialogForm.clearValidate();//清除校验结果
    },
    getUserList() {
      getUserList(this.param).then(res => {
        if (res.data.errorCode == 200) {
          let a = res.data.data;
          this.data = listToTree(a);
          if (this.data != null && this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
              this.data[i].pid = 0;
            }
          }
          //this.options = re.data.data;
        }
      })
    },
    submitForm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return;
        }
        // this.form.isDelete = this.form.isDelete == 1 ? true : false;
        // this.form.isUpdate = this.form.isUpdate == 1 ? true : false;
        if (this.dialogName.indexOf("新增") != -1) {//添加操作
          add(this.form).then(res => {
            if (res.data.errorCode == 200) {
              this.getUserList();
              this.dialogFormVisible = false;
            }
            this.$message.success(res.data.errorMsg);
          })
        } else {//修改操作
          // this.form.isDelete = this.form.isDelete == 1 ? true : false;
          // this.form.isUpdate = this.form.isUpdate == 1 ? true : false;
          // console.log(this.form)
          updateById(this.form).then(res => {
            if (res.data.errorCode == 200) {
              this.getUserList();
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
      }).then(() => {
        deleteById(row.id).then(res => {
          if (res.data.errorCode == 200) {
            this.getUserList();
          }
          this.$message.success(res.data.errorMsg);
        });
      });
    },
  },
}
</script>

<style scoped>

</style>
