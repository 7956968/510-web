<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.nocache"></router-view>
    </keep-alive>
   <router-view v-if="!$route.meta.nocache"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<!--<style>-->
<!--#app {-->
  <!--font-family: 'Avenir', Helvetica, Arial, sans-serif;-->
  <!-- -webkit-font-smoothing: antialiased;-->
  <!-- -moz-osx-font-smoothing: grayscale;-->
  <!--text-align: center;-->
  <!--color: #2c3e50;-->
  <!--/*margin-top: 0px;*/-->
  <!--margin: 0;-->
  <!--padding: 0;-->

<!--}-->
<!--</style>-->
