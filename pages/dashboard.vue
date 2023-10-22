<template>
    <div class="d-flex flex-column justify-center align-center height-vh">
        <img src="/welcome.svg" alt="welcome" width="50%">
        <p class="text-h6">Hi, {{user.name}}! Welcome to the application.</p>
        <v-btn color="grey" dark @click="logout">Logout</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {}
        }
    },
    layout: 'dashboard',
    mounted() {
        this.getUserInfo()
    },
    methods: {
        async getUserInfo() {
            
            this.user = JSON.parse(localStorage.getItem('usr')) || this.$store.getters.getUserInfo
            console.log(this.user)
        },
        logout() {
            this.$store.dispatch('logoutUser')
            .then( () =>  this.$router.push("/"))
        }
    }
}
</script>