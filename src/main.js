import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from 'vue-resource';
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '515585824434-m1k10ctuet53ucs27b19rba6ojqdjh6o.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account',
}
Vue.use(GAuth, gauthOption)

Vue.use(VueResource)

Vue.config.productionTip = false;
// Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
