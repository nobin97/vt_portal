<template>
  <div>
    <navbar/>
    <div id="nav" class="text-center">
      <router-link to="/">Home</router-link> |
      <router-link to="/share_everything">Share Everything</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div class="">
    <router-view />
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar.vue";

export default {
  components:{
    navbar
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color:rgb(211, 3, 3);
  text-decoration: none;
}
</style>
