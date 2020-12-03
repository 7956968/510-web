<template>
  <div class="index_main">
    <LoginNavbar></LoginNavbar>
    <LoginContent></LoginContent>
  </div>
</template>

<script>
  import {LoginNavbar,LoginContent}  from './components'
    export default {
      name: "login",
      components: {
        LoginNavbar,
        LoginContent,
      },


    }
</script>

<style scoped>
.index_main{
  width: 100%;
  min-width: 1000px;
  height:100%;
  min-height:  657px;
  background: #253046;
}
</style>
