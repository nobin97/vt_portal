<template>
  <div class="signin">
    <div class="row ml-2 mr-3 mt-2">
      <div class="col-lg-9">
        <a href="https://www.qburst.com/">
          <img src="https://www.google.com/a/cpanel/qburst.com/images/logo.gif?service=google_gsuite" alt="QBurst" height=55 width="140">
        </a>
      </div>
      <div class="col-sm-3 text-center" >
        <button
        class="btn btn-danger"
        style="float:right;"
        @click="handleClickSignIn"
        v-if="!isSignIn"
        :disabled="!isInit"
        >Sign In</button>
        <div class="" v-if="isSignIn">
          <strong>Hey, {{ username }}! </strong>&nbsp;
          <img :src="image_url" :alt="username" height=40 width="40" style="border-radius:50%;">&nbsp;
          <button
            class="btn btn-success"
            @click="handleClickSignOut"
            :disabled="!isInit"
          >Sign Out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "navbar",
  props: {
    msg: String
  },
  data() {
    return {
      isInit: false,
      isSignIn: false,
      BASE_URL:"http://api.internal-vt.qburst.build:8000/",
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
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClickSignIn: function() {
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          const profile = GoogleUser.getBasicProfile();
          this.data.id = profile.getId(); 
          this.data.full_name = profile.getName();
          this.data.first_name = profile.getGivenName();
          this.data.last_name = profile.getFamilyName();
          this.data.image_url = profile.getImageUrl();
          this.data.email = profile.getEmail();
          this.data.access_token = GoogleUser.getAuthResponse().access_token;
          this.isSignIn = this.$gAuth.isAuthorized;
          this.sendToBackend();
        })
        .catch(error => {
          console.log(error);
        });
    },
    sendToBackend: function(){
      this.$http
        .post(this.BASE_URL + "api/v1/accounts/login_check/", this.data)
        .then(response => {
          localStorage.setItem("jwt", response.body.data.token);
          localStorage.setItem("vt_user_id", response.body.data.id);
          localStorage.setItem("username", response.body.data.username);
          this.username = response.body.data.username;
          localStorage.setItem("image_url", response.body.data.image_url);
          this.image_url = response.body.data.image_url;
          localStorage.setItem("signedIn", true)
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClickSignOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          this.isSignIn = this.$gAuth.isAuthorized;
          localStorage.removeItem("jwt");
          localStorage.removeItem("username");
          localStorage.removeItem("image_url");
          localStorage.removeItem("vt_user_id");
          localStorage.setItem("signedIn", false)
          this.$router.push('/');
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    let that = this;
    that.handleClickSignIn();
    let checkGauthLoad = setInterval(function() {
      that.isInit = that.$gAuth.isInit;
      that.isSignIn = that.$gAuth.isAuthorized;
      if (that.isInit) clearInterval(checkGauthLoad);
    }, 1000);
  }
};
</script>