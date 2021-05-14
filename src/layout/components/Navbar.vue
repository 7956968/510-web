<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo_img" style="width:128px;height:40px" src="@/assets/logo_new_white.png"/>
      <span class="logo_text">集中管理平台：</span>
        欢迎您! <span class="link-type">{{userInfo.name}}</span> 本次登录时间:<span class="link-type">{{currentTime}}</span>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<error-log class="errLog-container right-menu-item"/>--><!--错误日志按钮-->

        <!--<el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">-->
          <screenfull class="screenfull right-menu-item"/>
        <!--</el-tooltip>-->
        <!--<lang-select class="international right-menu-item"/>-->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
         <!--<span class="svg-container ">-->
          <!--<svg-icon icon-class="user.vue" />-->
        <!--</span>-->
          <!--<img src="@/assets/head1.jpg" class="user.vue-avatar">-->
          <span >
            {{userInfo.name}}
          </span>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/myinfo" v-if="hasPermission('u_myInfo')">
            <el-dropdown-item>
              {{ $t('navbar.myInfo') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" >
            <router-link to="/user/modifyPassword">
            <el-dropdown-item>
              {{ $t('navbar.changePassword') }}
            </el-dropdown-item>
            </router-link>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import {hasPermission} from '@/utils/permission' // 权限判断函数
import {formatDate} from '@/utils/DateUtil'
import {getUser} from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect
  },
  created(){
    this.initData();
    this.createdTime();
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      userInfo:{},
        currentTime:'',
    }
  },
  methods: {
    hasPermission,
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    createdTime() {
        this.currentTime = formatDate(new Date(),"yyyy-MM-dd HH:mm:ss");
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    initData(){
      this.userInfo = JSON.parse(getUser());
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $nav_back:#272727;
  $nav_text:#fff;
  .logo_img{
    position: absolute;
    top: 3px;
  }
.navbar {
  position:fixed;
  width: 100%;
  background: #29d;
  /*background: $nav_back;*/
  z-index: 5;
  box-shadow: 1px 2px 10px 0 rgba(0, 0, 0, 0.1);

  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  .logo{
    float: left;
    margin: 0 20px;
    color:#fff;

    .logo_text{
      margin-left: 140px;
      color: $nav_text;
      font-size: 23px;

    }
  }

  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {

    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        color: $nav_text;
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
