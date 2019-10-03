<template>
  <div class="hello">
    <div class="row mr-5 mt-2">
      <button
        class="btn btn-danger"
        @click="handleClickSignIn"
        v-if="!isSignIn"
        :disabled="!isInit"
      >Sign In</button>
      <div class="" v-if="isSignIn">
        <strong>Hey, {{ username }}! </strong>&nbsp;
        <img :src="image_url" :alt="username" height=40 width="40" style="border-radius:50%;">&nbsp;
        <button
          class="btn btn-success"
          icon="fas fa-edit"
          @click="handleClickSignOut"
          :disabled="!isInit"
        >Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      isInit: false,
      isSignIn: false,
      username: localStorage.getItem("username"),
      image_url: localStorage.getItem("image_url"),
      data: {
        id: "", 
        full_name: "",
        first_name: "",
        last_name: "",
        image_url: "",
        email: "",
        access_token: "",
      } 
    };
  },
  methods: {
    handleClickLogin() {
      this.$gAuth
        .getAuthCode()
        .then(authCode => {
          //on success
          console.log("authCode", authCode);
        })
        .catch(error => {
          //on fail do something
        });
    },
    handleClickSignIn: function() {
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          //on success do something
          // console.log("GoogleUser", GoogleUser);
          // console.log("getId", GoogleUser.getId());
          const profile = GoogleUser.getBasicProfile();
          this.data.id = profile.getId(); 
          this.data.full_name = profile.getName();
          this.data.first_name = profile.getGivenName();
          this.data.last_name = profile.getFamilyName();
          this.data.image_url = profile.getImageUrl();
          this.data.email = profile.getEmail();
          this.data.access_token = GoogleUser.getAuthResponse();
          this.isSignIn = this.$gAuth.isAuthorized;
          this.sendToBackend();
        })
        .catch(error => {
          //on fail do something
        });
    },
    sendToBackend: function(){
      this.$http
        .post("http://localhost:8000/api/v1/accounts/login_check/", this.data)
        .then(response => {
          localStorage.setItem("jwt", response.body.data.token);
          localStorage.setItem("username", response.body.data.username);
          localStorage.setItem("image_url", response.body.data.image_url);
          console.log("reached backend", response.body.data.token);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClickSignOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          //on success do something
          this.isSignIn = this.$gAuth.isAuthorized;
          localStorage.removeItem("jwt");
          localStorage.removeItem("username");
          localStorage.removeItem("image_url");
          this.$router.push('/');
        })
        .catch(error => {
          //on fail do something
        });
    }
  },
  created() {
    let that = this;
    // console.log("created");
    // this.handleClickSignIn();
    // console.log("ran signin")
    let checkGauthLoad = setInterval(function() {
      that.isInit = that.$gAuth.isInit;
      that.isSignIn = that.$gAuth.isAuthorized;
      if (that.isInit) clearInterval(checkGauthLoad);
    }, 1000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  float: right;
}
</style>