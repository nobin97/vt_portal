<template>
  <div class="mainapp" id="main-app">
    <navbar/>
      <div id="myModal" class="modal fade" role="dialog">
        <div class="modal-dialog">

          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Let's Share...</h4>
            </div>
            <form v-on:submit.prevent="post_blog">
                <div class="modal-body">
                    <div class="form-group">
                      <label for="blogTitle">Title</label>
                      <input
                        type="text"
                        class="form-control"
                        id="blogTitle"
                        placeholder="Enter Title"
                        v-model="newBlog.title"
                        required="required">
                    </div>
                    <div class="form-group">
                      <label for="blogText">Text</label>
                      <textarea
                        class="form-control"
                        id="blogText"
                        placeholder="Enter Text"
                        v-model="newBlog.text"
                        required="required"
                        rows="10"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-primary">Post</button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </form>
            <!-- <div class="modal-body">
              <p>Some text in the modal.</p>
            </div> -->
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal" style="">Close</button>
            </div> -->
          </div>

        </div>
      </div>
      <div class="page-header ml-3 mt-3 mb-5 sticky-top" style="background-color:white;">
        <div class="row">
          <div class="col-lg-10">
            <h1 class="">Share Everything</h1>
          </div>
          <div class="col">
            <button class="btn btn-primary" data-toggle="modal" data-target="#myModal">Share</button>
          </div>
        </div>
      </div>

      <div class="leaderboard ml-1 mr-3" id="leaderboard" style="float:right; width:23%;">
        <div class="card">
          <h3 class="ml-2 mt-1">LeaderBoard</h3>
          <div class="card mt-1 ml-3 mr-3 mb-3" v-bind:key="item.id" v-for="(item, index) in leaderboard.data">
            <div class="card-body">
              <div class="row">
                <div class="col-md-2">
                  <h2>{{ index+1 }}</h2>
                </div>
                <div class="col-md-6">
                  <img :src="item.user.image_url" :alt="item.user.username" height=40 width="40" style="border-radius:50%;">
                  {{ item.user.username }}
                </div>
                <div class="col">
                  {{ item.score }}
                </div>
              </div>
            </div>
          </div>
          <div class="loading" v-if="lboard_loading===true">Hang on. We are Loading results...</div>
        </div>
      </div>
      <div class="container ml-5" id='main' style="max-width:70%;">
        <div class="card mb-3" v-bind:key="blog.id" v-for="blog in blogs.data" >
          <div class="card-body">
            <h2 class="card-title">{{ blog.title }}</h2>
            <small>{{ blog.created_at }} <img :src="blog.author.image_url" :alt="blog.author.username" height=25 width="25" style="border-radius:50%;">
           {{ blog.author.username }} ({{ blog.author.first_name }} {{ blog.author.last_name }}) </small>
            <p class="card-text mt-2">{{ blog.text }}</p>
            <hr>
            <div class="">
              <button class="btn btn-link" @click="up_vote(blog.id)"><img src="@/assets/claps.png" alt="Claps" height="30" width="30"></button>  {{ blog.upvote_count }}
            </div>
          </div>
        </div>
        <div class="loading" v-if="blogs.data===[]">0 Results Found. Come back later..</div>
        <div class="loading" v-if="loading===true">Hang on. We are Loading results...</div>
        <div class="loading" v-else-if="load_error===true">We are having trouble loading results at the moment. Try again later...</div>
      </div>
    </div>
</template>


<script>
import navbar from "@/components/navbar.vue";

export default {
  name: "ShareEverything",
  components: {
    
  },
  data() {
    return {
      page_title: "Share Everything",
      blog: [],
      blogs: [],
      loading: true,
      lboard_loading: false,
      load_error: false,
      leaderboard: [],
      blog_by_id: [],
      token: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiM2VmZjE2OGQtZjZlNS00NTg3LWE1ZmItMGJiOGM4YWY4NGJlIiwidXNlcm5hbWUiOiJub2JpbmpAcWJ1cnN0LmNvbSIsImV4cCI6MTU3MDExNDY4MCwiZW1haWwiOiJub2JpbmpAcWJ1cnN0LmNvbSJ9.t-_yIDMo_8nnSiqnPR41OrfeIbV9RjbQ1o4bi1ISEkU',
      newBlog: {'title': null, 'text': null}
    };
  },
  mounted: function(){
    this.get_all_blogs();
    this.get_leaderboard();
  },
  methods: {
    get_all_blogs: function() {
      this.loading = true;
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          this.blogs = response.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.load_error = true;
          console.log(err);
        });
    },
    get_blog: function(id) {
      console.log(id);
      this.loading = true;
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/" + id + "/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          this.upvote = response.status;
          this.loading = false;
          this.get_all_blogs();
        })
        .catch(err => {
          this.loading = false;
          console.log("some error");
          console.log(err);
        });
    },
    up_vote: function(id) {
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/" + id + "/upvote/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          console.log(this.blog_by_id);
          this.loading = false;
          this.get_all_blogs();
          this.get_leaderboard();
        })
        .catch(err => {
          this.loading = false;
          console.log("some error");
          console.log(err);
        });
    },
    get_leaderboard: function() {
      this.lboard_loading = true;
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/leaderboard/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          this.leaderboard = response.data;
          // console.log(this.leaderboard)
          this.lboard_loading = false;
        })
        .catch(err => {
          this.lboard_loading = false;
          this.load_error = true;
          console.log(err);
        });
    },
    post_blog: function() {
      this.loading = true;
      this.$http
        .post("http://localhost:8000/api/v1/share/blogs/", this.newBlog, {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          // this.leaderboard = response.data;
          console.log(response.data);
          this.loading = false;
          console.log("going to run");
          this.get_all_blogs();
          this.get_leaderboard();
          $("#myModal").modal("hide");
          console.log("ran");
        })
        .catch(err => {
          this.loading = false;
          this.load_error = true;
          console.log(err);
        });
    }
  }
};
</script>
