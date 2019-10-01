<template>
  <div class="home">
    <navbar></navbar>
    <dashboard></dashboard>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";
import dashboard from "@/components/dashboard.vue";


export default {
  name: 'navbar',
  components: {
    navbar,
    dashboard
     
  }
};
</script>
