<template>
    <v-row>
        <v-col cols="7" class="d-flex justify-center align-center height-vh banner">
            <img src="/banner.png" width="50%" alt="banner">
        </v-col>
        <v-col cols="5" class="d-flex justify-center">
            <div class="w-100 pa-16">
                <v-slide-x-transition hide-on-leave>
                    <template v-if="tab == 'signup'" >
                    <v-form ref="signup_form" v-model="signup_valid" class="shrink">
                        <h2 class="font-weight-black">Welcome</h2>
                        <p class="font-weight-light mb-10">Create your account.</p>
                        
                        <v-text-field outlined rounded dense label="Name" placeholder="Enter your Name" :rules="[rules.required]" v-model="signup.name"/>
                        <v-text-field outlined rounded dense label="Email" placeholder="Enter your Email" :rules="emailRule" v-model="signup.email"/>
                        <v-text-field outlined rounded dense label="Password" placeholder="Enter your Password" :rules="passwordRule" v-model="signup.password" :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click:append="showPassword = !showPassword" :type="showPassword ? 'text' : 'password'"/>
                        <v-slide-x-transition>
                            <v-text-field v-if="signup.password" outlined rounded dense label="Confirm Password" placeholder="Confirm your Password" :rules="confirmPasswordRule" v-model="signup.confirm_password" :append-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click:append="showConfirmPassword = !showConfirmPassword" :type="showConfirmPassword ? 'text' : 'password'"/>
                        </v-slide-x-transition>
                        <v-btn color="#ff725e" rounded large depressed class="w-100 mt-3 white--text" :disabled="!signup_valid" @click="submitSignup" :loading="submitted">Sign Up</v-btn>

                        <p class="my-5 text-center font-weight-light">Already have an account? <a @click="tab = 'signin'" class="text-decoration-none">Sign In here.</a></p>
                    </v-form>
                    </template>
                </v-slide-x-transition>
                <v-slide-x-transition hide-on-leave>
                    <template v-if="tab == 'signin'">
                    <v-form ref="signup-form" v-model="signin_valid" >
                        <h2 class="font-weight-black">Welcome</h2>
                        <p class="font-weight-light mb-10">Sign in to your account.</p>
                        
                        <v-text-field outlined rounded dense label="Email" placeholder="Enter your Email" :rules="[rules.required]" v-model="signin.email"/>
                        <v-text-field outlined rounded dense label="Password" placeholder="Enter your Password" :rules="[rules.required]" v-model="signin.password" :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click:append="showPassword = !showPassword" :type="showPassword ? 'text' : 'password'"/>
                        <v-btn color="#ff725e" rounded large depressed class="w-100 mt-3 white--text" :disabled="!signin_valid" @click="submitSignin" :loading="submitted">Sign In</v-btn>

                        <p class="my-5 text-center font-weight-light">Doesn't have an account yet? <a @click="tab = 'signup'" class="text-decoration-none">Sign Up here.</a></p>
                    </v-form>
                    </template>
                </v-slide-x-transition>

                <v-snackbar v-model="snackbar" elevation="24" :color="snackbar_status.status == 'success' ? 'green' : 'red'" dark :timeout="3000">
                {{ snackbar_status.message }}

                <template v-slot:action="{ attrs }">
                    <v-btn
                    color="black"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                    >
                    Close
                    </v-btn>
                </template>
                </v-snackbar>
            </div>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            rules: {
                required: value => !!value || 'This field is required.',
            },
            emailRule: [ 
                v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            ],
            passwordRule: [
                value => !!value || 'Please enter a password',
                (value) => !!value || 'Please type password.',
                (value) => (value && /\d/.test(value)) || 'At least one digit',
                (value) => (value && /[A-Z]{1}/.test(value)) || 'At least one capital latter',
                (value) => (value && /[^A-Za-z0-9]/.test(value)) || 'At least one special character',
                (value) => (value && value.length > 8 ) || 'At least 8 characters',
            ],
            confirmPasswordRule: [
                (value) => !!value || 'Please confirm your password',
                (value) => value === this.signup.password || 'The password confirmation does not match.',
            ],
            showPassword: false,
            showConfirmPassword: false,
            signup: {
                name: '',
                email: '',
                password: '',
                confirm_password: ''
            },
            signin: {
                email: '',
                password: ''
            },
            signup_valid: true,
            signin_valid: true,
            tab: 'signin',
            submitted: false,
            snackbar: false,
            snackbar_status: {
                status: '',
                message: ''
            }
        }
    },
    methods: {
        async submitSignup() {
            this.submitted = true
            
            await this.$axios.$post('/users/signup', this.signup)
            .then(async res => {
                this.submitted = false
                this.tab = 'signin'
                this.showSnackbar('success', res.message)
                
                /* After successful signup, users should be redirected to the application page. */
                this.$store.dispatch('authenticateUser', {email: this.signup.email, password: this.signup.password})
                .then((res) => {
                    if (this.$store.getters.isAuthenticated) {
                        this.isAuth = true
                        var user = this.$store.getters.getUserInfo

                        this.$router.push("/dashboard")
                    }
                })
            }).catch(err => {
                this.showSnackbar('error', err.response.data.error)
            })
        },
        async submitSignin() {
            this.submitted = true
            
            this.$store.dispatch('authenticateUser', this.signin)
                .then((res) => {
                    if (this.$store.getters.isAuthenticated) {
                        this.isAuth = true
                        var user = this.$store.getters.getUserInfo

                        this.$router.push("/dashboard")
                    } else {
                        this.submitted = false
                        this.showSnackbar('error', 'Incorrect email and password')
                    }
                })
        },
        showSnackbar(status, message) {
            this.snackbar = true
            this.snackbar_status = {
                status: status,
                message: message
            }
            setTimeout(()=>{
                this.snackbar = false
            }, 3000)
        }
    }
}
</script>

<style scoped>
.banner {
    background-color: #fca6a6;
}
</style>