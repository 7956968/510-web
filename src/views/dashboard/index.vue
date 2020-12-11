<template>
  <div class="content_container"  >
<!--    <div >-->
<!--      欢迎您! <span class="link-type">{{userInfo.name}}</span> 本次登录时间:<span class="link-type">{{currentTime}}</span>-->
<!--    </div>-->
    <div>
      <!--<panel-group @handleSetLineChartData="handleSetLineChartData"/>-->
      <div class="el-row information_container " style="margin-top:20px">
        <h4>快捷方式:</h4>
        <el-row class="page-guide">

          <el-col  class="container"   v-if="this.userInfo.type == ''">
            <img src="@/assets/visitor.jpg" alt="Norway" width="1000" height="300">
            <div class="center" @click="router_jump('/appointment/index')">访客预约</div>
          </el-col>
          <el-col  class="container" v-show="hasPermission('m_user')" >
            <img src="@/assets/yuangong.png" alt="Norway" width="1000" height="300"  >
            <div class="center" @click="router_jump('/user.vue/user.vue')">员工管理</div>
          </el-col>
          <el-col  class="container" v-show="hasPermission('m_device')">
            <img src="@/assets/device.png" alt="Norway" width="1000" height="300">
            <div class="center"  @click="router_jump('/device/info')">设备管理</div>
          </el-col>
          <el-col  class="container" v-show="hasPermission('m_access')" >
            <img src="@/assets/attendance.png" alt="Norway" width="1000" height="300">
            <div class="center" @click="router_jump('/access/index')">出入记录</div>
          </el-col>
        </el-row>
      </div>
    </div>
      <!--<panel-group @handleSetLineChartData="handleSetLineChartData"/>-->
      <div class="el-row information_container " v-show="">
        <el-row class="page-guide">
          <el-col class="title">
            <span style="display: block;-webkit-margin-before: 1.33em;-webkit-margin-after: 1.33em;    font-weight: bold;">访客统计：</span>
          </el-col>
          <el-col  class="department">
            <span style="display: block;-webkit-margin-before: 1.33em;-webkit-margin-after: 1.33em;    font-weight: bold;">全部</span>
          </el-col>
          <el-col  class="department">
            <span style="display: block;-webkit-margin-before: 1.33em;-webkit-margin-after: 1.33em;    font-weight: bold;">销售部</span>
          </el-col>
          <el-col  class="department">
            <span style="display: block;-webkit-margin-before: 1.33em;-webkit-margin-after: 1.33em;    font-weight: bold;">财务部</span>
          </el-col>
          <el-col  class="department">
            <span style="display: block;-webkit-margin-before: 1.33em;-webkit-margin-after: 1.33em;    font-weight: bold;">研发部</span>
          </el-col> <el-col  class="department">
          <span style="display: block;-webkit-margin-before: 1.33em;-webkit-margin-after: 1.33em;    font-weight: bold;">算法部</span>
        </el-col>

        </el-row>
        <div id="main" style="width: 100%;height: 400px"></div>
      </div>

  </div>

</template>

<script>
    import echarts from 'echarts'

  import {mapGetters} from 'vuex'
  import {formatDate} from '@/utils/DateUtil'
  import {hasPermission} from '@/utils/permission' // 权限判断函数
  import PanelGroup from './components/PanelGroup'




  export default {
    name: 'Dashboard',
    components: {
      PanelGroup
    },
    data() {
      return {
        back_img: require('@/assets/background.jpg'),
        currentRole: 'adminDashboard',
        currentTime:'',
          charts: '',
            //opinion: ["1", "10", "20", "30", "40","50"],
          allOpinionData: ["270", "290", "230", "230", "240","290","350"],
          OpinionData1: ["30", "60", "20", "40", "30","50","80"],
          OpinionData2: ["80", "90", "20", "40", "30","100","90"],
          OpinionData3: ["90", "100", "200", "150", "100","70","90"],
          OpinionData4: ["70", "40", "90", "100", "80","70","90"],
          chartsTitle:'全部',
      }
    },
    computed: {
      ...mapGetters([
        'roles',
        'userInfo'
      ])
    },
    methods: {
      isShow(){
      },
      hasPermission,
      handleSetLineChartData(type) {

      },
      router_jump(path){

        this.$router.push({path:  path})
      }
    },
      //调用
      mounted() {
          this.$nextTick(function() {
              this.drawLine('main')
          })
      },
    created() {
      this.currentTime = formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
    },

  }
</script>
<style scoped>
  .dashboard-container {
    margin: 20px;

  }

  .information_container {
    background: rgb(255, 255, 255);
    padding: 16px 16px 0px;
    margin-bottom: 32px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    min-height: 200px;

  }

  .page-guide .content li {
    font-size: 14px;
    margin-bottom: 10px;
    color: #99a9bf;
    list-style: none;
  }

  .page-guide .content li:before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    vertical-align: middle;
    background-color: #5e6d82;
    margin-right: 5px;
  }
  .container {
    position: relative;
    width: 30%;
    margin-right: 20px;
    margin-bottom:20px;
    height:4%;
    border-radius:5px;
  }
  .container:hover {
    border:2px solid #887a7a;
  }
  .title{
    position: relative;
    width: 10%;
    margin-right: 20px;
    margin-bottom:20px;
    height:100px;
    border-radius:5px;
  }
  .department{
    position: relative;
    width: 5%;
    border-radius:5px;
  }
  .department:hover {
    border:2px solid #887a7a;
  }
  .topleft {
    position: absolute;
    top: 8px;
    left: 16px;
    font-size: 18px;
  }
  .department {
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
    color:#3836de;
  }
  .center {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    text-align: center;
    font-size: 18px;
    margin-top:-9px;
    line-height: 18px;
    cursor: pointer;
    font-weight: bold;
    color:#3836de;
  }

  img {
    border-radius:5px;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

</style>
