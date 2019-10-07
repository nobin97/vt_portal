<template>
  <div class="mainapp flexBox" id="main-app">

    <!--Post Modal-->
    <div id="postModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Let's Share...</h4>
          </div>
          <form v-on:submit.prevent="postBlog">
            <div class="modal-body">
              <div class="form-group">
                <label for="blogTitle">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="blogTitle"
                  placeholder="Enter Title"
                  v-model="newBlog.title"
                  required="required"
                />
              </div>
              <div class="form-group">
                <label for="blogText">Text</label>
                <textarea
                  class="form-control"
                  id="blogText"
                  placeholder="Enter Text"
                  v-model="newBlog.text"
                  required="required"
                  rows="10"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Post</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--Post Modal ends here-->

    <!--Post Update Modal-->
    <div id="postUpdateModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Editing...</h4>
          </div>
          <form v-on:submit.prevent="updateBlog(updateBlogData.data.id)">
            <div class="modal-body">
              <div class="form-group">
                <label for="blogTitle">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="blogTitle"
                  placeholder="Enter Title"
                  v-model="updateBlogData.data.title"
                  required="required"
                />
              </div>
              <div class="form-group">
                <label for="blogText">Text</label>
                <textarea
                  class="form-control"
                  id="blogText"
                  placeholder="Enter Text"
                  v-model="updateBlogData.data.text"
                  required="required"
                  rows="10"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Update</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--Post Update Modal ends here-->

    <!--Post View Modal-->
    <div id="postViewModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title text-center">{{ blog.data.title }}</h4>
          </div>
          <div class="modal-body">
            <article>{{ blog.data.text }}</article>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close </button>
          </div>
        </div>
      </div>
    </div>
    <!--Post View Modal ends here-->

    <!--Post Delete Modal-->
    <div id="postDeleteModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title text-center">Delete?</h4>
          </div>
          <div class="modal-body">
            <b>Are you sure?</b>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
            <button @click="postDelete(getBlogId)" type="button" class="btn btn-secondary" data-dismiss="modal">Yes</button>
          </div>
        </div>
      </div>
    </div>
    <!--Post Delete Modal ends here-->

    <!--Page Header-->
    <div class="page-header ml-3 mt-3 mb-5 sticky-top" style="background-color:white;">
      <div class="row">
        <div class="col-lg-10">
          <h1 class>Share Everything</h1>
        </div>
        <div class="col" v-if="load_error===false">
          <button class="btn btn-primary" data-toggle="modal" data-target="#postModal">Share</button>
        </div>
      </div>
    </div>
    <!--Page Header ends here-->

    <!--LeaderBoard-->
    <div
      class="leaderboard mr-5"
      id="leaderboard"
      v-if="load_error===false"
      style="float:right; width:27%;"
    >
      <div class="card">
        <h3 class="ml-2 text-center">LeaderBoard</h3>
        <div
          class="card mt-1 ml-2 mr-2 mb-2"
          v-bind:key="item.id"
          v-for="(item, index) in leaderboard.data"
        >
          <div class="card-body">
            <div class="row">
              <div class="col-md-2 text-center">
                <h2>{{ index+1 }}</h2>
              </div>
              <div class="col-md-6">
                <img
                  :src="item.user.image_url"
                  :alt="item.user.username"
                  height="35"
                  width="35"
                  style="border-radius:50%;"
                />
                &nbsp;{{ item.user.username }}
              </div>
              <div class="col text-center"><b> {{ item.score }} </b></div>
            </div>
          </div>
        </div>
        <div class="loading" v-if="lboard_loading===true">Hang on. We are Loading results...</div>
      </div>
    </div>
    <!--LeaderBoard ends here-->

    <!--Blog Listing-->
    <div class="container ml-5" id="main" style="max-width:65%;">
      <div class="card mb-3" v-bind:key="blog.id" v-for="blog in blogs.data">
        <div class="card-body">
          <div class="edit_blog" v-if="blog.author.id === vt_user_id">
            <button @click="openBlogUpdateModal(blog.id)" class="btn btn-outline-dark">Edit</button>
            &nbsp;
            <button @click="setBlogIdAndDelete(blog.id)" class="btn btn-outline-danger">Delete</button>
          </div>
          <a class="blog_title" href="#" @click="getBlog(blog.id)">
            <h2 class="card-title">{{ blog.title }}</h2>
          </a>
          <small>
            {{ blog.created_at }}
            <img
              :src="blog.author.image_url"
              :alt="blog.author.username"
              height="25"
              width="25"
              style="border-radius:50%;"
            />
            {{ blog.author.username }} ({{ blog.author.first_name }} {{ blog.author.last_name }})
          </small>
          <!-- <p class="card-text mt-2">{{ blog.text }}</p> -->
          <hr />
          <div class="upvote_details">
            <button class="btn btn-link" @click="upVote(blog.id)">
              <img
                v-if="blog.is_upvoted"
                src="@/assets/claps.png"
                alt="Claps"
                height="30"
                width="30"
              />
              <img
                v-if="blog.is_upvoted===false"
                src="@/assets/not_clap.png"
                alt="Claps"
                height="40"
                width="40"
              />
            </button>
            <strong> {{ blog.upvote_count }} </strong>
            <span v-if="blog.upvote_count > 0"> | <small> Liked by </small> <span :key="upvoter.id" v-for="upvoter in blog.upvoted_by"><img :src="upvoter.image_url" alt="" height="18" width="18" style="border-radius:50%;"></span></span>
          </div>
        </div>
      </div>
      <div class="loading" v-if="loading===true">Hang on. We are Loading results...</div>
      <div class="loading" v-else-if="load_error===true">
        <strong>We are having trouble loading results at the moment. Make sure you are signed in...</strong>
      </div>
      <div v-if="blogs.data">
        <div class="loading" v-if="blogs.data.length===0"><strong> 0 Results Found. Come back later or share a new Post... </strong></div>
      </div>
    </div>
    <!--Blog Listing ends here-->

  </div>
</template>


<script>
import navbar from "@/components/navbar.vue";
import { log } from 'util';

export default {
  name: "ShareEverything",
  components: {},
  props: {
    isSignIn: Boolean
  },
  data() {
    return {
      signedIn: localStorage.getItem("signedIn"),
      vt_user_id: localStorage.getItem("vt_user_id"),
      page_title: "Share Everything",
      blog: {
        data: {
          "title": "",
          "text": ""
        }
      },
      blogs: [],
      loading: true,
      lboard_loading: false,
      load_error: false,
      getBlogId: "",
      updateBlogData:{
        data: {
          "id": "",
          "title": "",
          "text": ""
        }
      },
      leaderboard: [],
      token: "Token " + localStorage.getItem("jwt"),
      newBlog: { title: null, text: null }
    };
  },
  mounted: function() {
    if (this.signedIn === "true") {
      this.getAllBlogs();
      this.getLeaderboard();
    }
    else {
      this.loading = false;
      this.lboard_loading = false;
      this.load_error = true;
    }
  },
  methods: {
    setBlogIdAndDelete: function(id) {
      this.getBlogId = id;
      $("#postDeleteModal").modal("show");
      console.log(id, "set")
    },
    openBlogUpdateModal: function(id){
      this.loading = true;
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/" + id + "/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          this.updateBlogData = response.data
          this.loading = false;
          $("#postUpdateModal").modal("show");
        })
        .catch(err => {
          this.loading = false;
          console.log("some error");
          console.log(err);
        });
    },
    updateBlog: function(id){
      var data = {
        "title": this.updateBlogData.data.title, 
        "text":this.updateBlogData.data.text
        }
      this.loading = true;
      this.$http
        .put("http://localhost:8000/api/v1/share/blogs/" + id + "/", data, {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          console.log(response.data, response.status);
          this.getAllBlogs();
          this.getLeaderboard();
          $("#postUpdateModal").modal("hide");
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.load_error = true;
          console.log(err);
        });
    },
    postDelete: function(id) {
      this.loading = true;
      this.$http
        .delete("http://localhost:8000/api/v1/share/blogs/" + id + "/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          console.log(response.data, response.status);
          this.getAllBlogs();
          this.getLeaderboard();
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.load_error = true;
          console.log(err);
        });
    },
    getAllBlogs: function() {
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
    getBlog: function(id) {
      console.log(id);
      this.loading = true;
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/" + id + "/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          this.blog = response.data
          this.loading = false;
          $("#postViewModal").modal("show");
        })
        .catch(err => {
          this.loading = false;
          console.log("some error");
          console.log(err);
        });
    },
    upVote: function(id) {
      this.$http
        .get("http://localhost:8000/api/v1/share/blogs/" + id + "/upvote/", {
          headers: {
            Authorization: this.token
          }
        })
        .then(response => {
          console.log(this.blog_by_id);
          this.loading = false;
          this.getAllBlogs();
          this.getLeaderboard();
        })
        .catch(err => {
          this.loading = false;
          console.log("some error");
          console.log(err);
        });
    },
    getLeaderboard: function() {
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
    postBlog: function() {
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
          this.getAllBlogs();
          this.getLeaderboard();
          $("#postModal").modal("hide");
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

<style scoped>
  .blog_title {
    color: black;
    text-decoration: none;
  }
  .edit_blog {
    text-align: right;
  }
</style>