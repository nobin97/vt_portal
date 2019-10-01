import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from 'bootstrap-vue'
//import VueResource from 'vue-resource';

//Vue.use(VueResource)

Vue.config.productionTip = false;
Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  // BootstrapVue,
  render: h => h(App)
}).$mount("#app");
