import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import ShareEverything from "./views/ShareEverything.vue";
import readBlog from "./views/readBlog.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/share_everything",
      name: "share_everything",
      component: ShareEverything
    },
    {
      path: "/read/:id",
      name: "share_everything_read_blog",
      component: readBlog
    }
  ]
});
