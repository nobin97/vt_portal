<template>
    <div class="col-lg-10">
        <b-navbar />
        <h3 class><strong>VIRTUAL TEAMS</strong></h3>
    </div>
</template>

<script>
import navbar from "@/components/navbar.vue";

export default {
    name: "vt list",
    components: {},
    props: {
        isSignIn: Boolean
    },
    data() {
        return {
            signedIn: localStorage.getItem("signedIn"),
            page_title: "Virtual Teams",
            loading: true,
            load_error: false,
            virtual_teams: [],
            virtual_team_by_id: {},
            token: "Token " + localStorage.getItem("jwt"),
            new_virtual_team: {title: null},
        };
    },
    mounted: function() {
        if (this.signedIn === "true") {
            this.get_all_virtual_teams();
        }
        else {
            this.loading = false;
            this.load_error = true;
        }
    },
    methods: {
        get_all_virtual_teams: function(){
            this.loading = true;
            this.$http
                .get("http://localhost:8000/api/v1/virtual_team/list/", {
                    headers: {
                        Authorization: this.token
                    }
                })
                .then(response => {
                    this.virtual_teams = response.data;
                    console.log(this.virtual_teams);
                    this.loading = false; 
                })
                .catch(err => {
                    this.loading = false;
                    this.load_error = true;
                    console.log(err);
                });
        },
        get_virtual_team: function(id) {
            console.log(id);
            this.loading = true;
            this.$http
                .get("http://localhost:8000/api/v1/virtual_team/list/" + id + "/", {
                    headers: {
                        Authorization: this.token
                    }
                })
                .then(response => {
                    this.virtual_team_by_id = response.data;
                    console.log(this.virtual_team);
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    this.load_error = true;
                    console.log(err);
                });
        },

    }
};
</script>

<style scoped>
h3{
    text-align: center
}

</style>