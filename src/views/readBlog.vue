<template>
  <div class="readBlog container">
    <router-link to="/share_everything">
      <button class="btn btn-primary">Back</button>
    </router-link>
    <br />
    <br />
    <h1 v-html="blog.data.title" />
    <article v-html="compiledMarkdown" />
    <!-- ?{{ this.blog.data }} -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "Token " + localStorage.getItem("jwt"),
      signedIn: localStorage.getItem("signedIn"),
      vt_user_id: localStorage.getItem("vt_user_id"),
      loading: true,
      BASE_URL:"http://api.internal-vt.qburst.build:8000/",
      blog: {
        data: {
          title: "",
          text: ""
        }
      }
    };
  },
  mounted: function() {
    this.getBlog();
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.blog.data.text, { sanitize: true });
    }
  },
  methods: {
    getBlog: function() {
      this.loading = true;
      this.$http
        .get(
          this.BASE_URL + "api/v1/share/blogs/" +
            this.$route.params.id +
            "/",
          {
            headers: {
              Authorization: this.token
            }
          }
        )
        .then(response => {
          this.blog = response.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  }
};
</script>