<template>
  <div id="google-signin-button">
  </div>
</template>

<script>
export default {
  name: "GLogin",
  data() {
    return {
      data: {
        id: "", 
        full_name: "",
        first_name: "",
        last_name: "",
        image_url: "",
        email: "",
        access_token: "",
      } 
    }
  },
  mounted() {
    gapi.signin2.render('google-signin-button', {
      onsuccess: this.onSignIn
    })
  },
  methods: {
    onSignIn (user) {
      const profile = user.getBasicProfile()
      this.data.id = profile.getId(); // Don't send this directly to your server!
      this.data.full_name = profile.getName();
      this.data.first_name = profile.getGivenName();
      this.data.last_name = profile.getFamilyName();
      this.data.image_url = profile.getImageUrl();
      this.data.email = profile.getEmail();
      this.data.access_token = user.getAuthResponse().access_token;
      this.sendToBackend();
    },
    sendToBackend: function() {
      this.loading = true;
      this.$http
        .post("http://localhost:8000/api/v1/accounts/login_check/", this.data)
        .then(response => {
          console.log("reached backend", this.email);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
</script>