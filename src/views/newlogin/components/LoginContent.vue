<template>
  <div class="login_main">
    <!--<div class="login_pic_container">-->
      <!--<img class="logo_img"  src="@/assets/login_pic.png"/>-->
    <!--</div>-->
    <!--<div class="login_form_container ">-->
      <!--<LoginForm></LoginForm>-->
    <!--</div>-->

    <el-col :span="14" class="login_pic_container">
      <img class="logo_img"  src="@/assets/login_background.png"/>
    </el-col>
    <el-col :span="10" class="login_form_container ">
      <LoginForm></LoginForm>
    </el-col>
  </div>

</template>

<script>
  import LoginForm  from './LoginForm'
    export default {
        name: "LoginContent",
        components: {
          LoginForm
        },
    }
</script>

<style scoped>
  .login_main{
    display: flex;
    justify-content:center;
    align-items:Center;
    height:calc(100% - 60px);
    min-height: 597px;
    min-width: 1000px;
    max-width: 1200px;
    width: 80%;
    margin: 0 auto;
    position: relative;
  }
  .logo_img{
    width:auto;
    max-width: 100%;
    height: 100%;
  }
  .login_pic_container{
    max-height: 100%;
    height: calc(100% - 70px);
    float: left;
  }
  .login_form_container{
    /*margin-top: 80px;*/
    float: right;
  }
</style>
