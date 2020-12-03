<template>
    <div class="form_container">
      <div class="login-form" v-show="currentPage == 'login'">
        <div class="title-container">
          <h3 class="title">登录系统</h3>
        </div>
        <hr class="split_line">
        <div class="form_content">
        <el-form ref="loginForm" :rules="loginRules" :model="loginForm" size="mini">

          <el-form-item prop="raw_username">
            <el-input
              v-model.trim="loginForm.raw_username"
              :placeholder="jobName"
              name="username"
              type="text"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item >
            <el-input
              :type="passwordType"
              v-model.trim="loginForm.password"
              :placeholder="$t('login.password')"
              name="password"
              auto-complete="on"
              @keyup.enter.native="handleLogin"/>
          </el-form-item>

<!--          <el-form-item prop="imageCode">-->
<!--            <el-col :span="19">-->
<!--              <el-input-->
<!--                type="text"-->
<!--                v-model.trim="loginForm.imageCode"-->
<!--                :placeholder="$t('login.imageCode')"-->
<!--                name="imageCode"-->
<!--                auto-complete="on"-->
<!--              />-->
<!--            </el-col>-->
<!--            <el-col :span="5">-->
<!--              <img id="validateImg" style="width: 100%;height:28px;" @click="refreshCode" src="/">-->
<!--            </el-col>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-radio-group v-model="loginForm.userType" style="margin: 0 auto">-->
<!--              <el-radio label="1">员工</el-radio>-->
<!--              <el-radio label="3">管理员</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;background: #f5856d;border:none" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
          <!--<div style="text-align: right" >-->
           <!--<span class="link-type" @click="currentPage ='register' ">注册账号</span>-->
          <!--</div>-->
        </el-form>
      </div>
      </div>

      <div class="register-form" v-show="currentPage == 'register'">
        <div class="title-container">
          <h3 class="title">注册</h3>
        </div>
        <hr class="split_line">
        <div class="form_content">
        <el-form :label-position="'left'" ref="registerForm" :rules="registerRules" :model="registerForm" label-width="80px"  size="mini">
          <el-form-item label="公司名称" prop="cname">
            <el-input v-model.trim="registerForm.cname"  name="phone"
                      type="text"
                      auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="registerForm.phone"  name="phone"
                      type="text"
                      auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="registerForm.password"  :type="passwordType"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="smsCode">
            <el-col :span="12">
              <el-input v-model.trim="registerForm.smsCode" ></el-input>
            </el-col>
            <el-col :span="12">
              <el-button  ref="codeButton" @click="getCode">{{codeButtonValue}}</el-button>
            </el-col>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="register">确认注册</el-button>
          <div style="text-align: center" >
            已有账号?&nbsp;<span class="link-type" @click="currentPage ='login' ">立即登录</span>
          </div>
        </el-form>
        </div>
      </div>
    </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import { Message,MessageBox } from 'element-ui'
  import {checkCode,register,checkPhone} from '@/api/login';
  import store from '@/store'

  export default {
    name: 'LoginForm',
    // components: {LangSelect},
    mounted(){
      var temp = this;
      this.refreshCode();
      document.onkeydown = function(e) {
        var key = window.event.keyCode;
        if (key == 13) {
          temp.handleLogin();
        }
      }
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePhoneRegister = (rule, value, callback) => {
        if (value.length != 11) {
          callback(new Error('请输入正确的手机号'))
        } else {
          let phoneParam = {
            phone:value
          }
          checkPhone(phoneParam).then(response=>{
            if(response.data.errorCode != 200){
              callback(new Error(response.data.errorMsg))
            }else{
              callback()
            }
          })

        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度不能低于6位'))
        } else {
          callback()
        }
      }
      const validateCheckCode = (rule, value, callback) => {
        if (value.length < 4) {
          callback(new Error('验证码格式错误'))
        } else {
          callback()
        }
      }
      const validateCname = (rule, value, callback) => {
        if (value == null || value =="") {
          callback(new Error('请输入公司名称'))
        } else {

          callback()
        }
      }
      return {
        jobName:'工号',
        loginForm: {
          raw_username:'',
          code:'',
          username: '',
          userType:'3',
          password: '',
          imageCode:''
        },
        registerForm:{
          cname:"",
          phone:'',
          password:'',
          smsCode:''
        },
        loginRules: {
          raw_username: [{required: true, trigger: 'blur', validator: validatePhone}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          imageCode: [{required: true, trigger: 'blur', validator: validateCheckCode}],
          code: [{required: true, trigger: 'blur', message: "请输入公司代码"}],
        },
        registerRules:{
          cname: [{required: true, trigger: 'blur', validator: validateCname}],
          phone: [{required: true, trigger: 'blur', validator: validatePhoneRegister}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          smsCode: [{required: true, trigger: 'blur', validator: validateCheckCode}]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        redirect: undefined,
        currentPage:'login',
        codeButtonValue:'获取验证码',
        totalTime:60,
        canClick: true //添加canClick
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }

    },
    methods: {
      checkPhone,
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.loginForm.username = this.loginForm.raw_username;
            this.$store.dispatch('LoginByUsername', this.loginForm).then((response) => {
              this.loading = false
              this.$router.push({path:  '/'})
            }).catch((err) => {
              if(err.response.data.errorMsg.indexOf("验证码") != -1 ){
                this.refreshCode();
              }
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // //刷新验证码
      // refreshCode(){
      //   var validateImg = document.getElementById("validateImg");
      //   validateImg.src = process.env.BASE_API+"code/image?width=67" +new Date().getTime();
      //
      // },


      getCode () {
        if (!this.canClick) return  ;
        this.$refs.registerForm.clearValidate();//清除上次的校验结果

        this.$refs.registerForm.validateField("phone",message=>{
          if(message != "" ){
            return;
          }
          this.canClick = false
          this.codeButtonValue = this.totalTime +"s后刷新";
          checkCode(this.registerForm).then(response=>{
          })
          let clock = window.setInterval(() => {
            this.totalTime--;
            this.codeButtonValue = this.totalTime +"s后刷新";
            if (this.totalTime < 0) {
              window.clearInterval(clock)
              this.codeButtonValue = '获取验证码'
              this.totalTime = 60;
              this.canClick = true;  //这里重新开启
            }
          }, 1000)
        })

      },

      register(){

        this.$refs.registerForm.validate(valid =>{
          if(!valid){
            return;
          }
          register(this.registerForm).then(response=>{
            let result = response.data;
            if(result.errorCode == 200){
              this.loginForm.username=this.registerForm.phone;
              this.loginForm.password="";
              this.$refs.registerForm.resetFields();//清空注册表单
              this.currentPage = "login";
              Message.success("注册成功,请前往登录");
            }else  if(result.errorCode == "4102"){//验证码相关错误
              this.$refs.registerForm.fields[2].error=result.errorMsg;
              this.refreshCode();
              Message.success(result.errorMsg);
            }else if(result.errorCode == "4101"){//手机号相关错误
              this.$refs.registerForm.fields[0].error=result.errorMsg;
              Message.success(result.errorMsg);
            }
          });


        })
      },

    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #fff;
  $dark_gray: #889aa4;
  $light_gray: #eee;


  .form_container{
    float: right;
    width: 338px;
   // height:350px;
    background: #fff;
    padding-bottom: 15px;
    margin-right: 60px;
  }


  .form_content{
    margin-top: 20px;
    margin-left: 40px;
    margin-right: 40px;
  }


  .title-container {
    position: relative;
    .title {
      font-size: 18px;
      color: #444444;
      margin: 0px auto;
      padding-top: 40px;
      text-align: center;
      font-weight: bold;
    }

  }



</style>
