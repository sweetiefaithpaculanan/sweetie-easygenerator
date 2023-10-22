import Vuex from "vuex";
import jwt from 'jsonwebtoken'
import Cookie from 'js-cookie'

const createStore = () => {
    return new Vuex.Store({
        state: {
            token: null,
            userObj: {},
            userInfo: null
        },
        mutations: {
            setToken(state, payload) {
                state.token = payload
            },
            clearToken(state) {
                state.token = null
            },
            setUser(state, payload) {
                state.userInfo = payload
            },
            clearUser(state){
                state.userInfo = null
            },
        },
        actions: {
            authenticateUser({ commit, state }, data) {

                return this.$axios.$post('/auth/login', {
                    email: data.email,
                    password: data.password
                })
                    .then(res => {
                        Cookie.set('easygenerator-cookie', res.access_token)
                        commit('setToken', res.access_token)
                        commit('setUser', res.user)

                        function replacer(key,value)
                        {
                            if (key=="password") return undefined;
                            else if (key=="unique_token") return undefined;
                            else return value;
                        }

                        
                        localStorage.setItem('usr', JSON.stringify(res.user, replacer))
                        localStorage.setItem('easygenerator-token', res.access_token)

                    }).catch(e => console.log(e))

            },
            initAuth(context, req) {
                let token;

                if (req) {
                    if (!req.headers.cookie) {
                        return;
                    }

                    const theCookie = req.headers.cookie
                        .split(";")
                        .find(c => c.trim().startsWith("easygenerator-cookie="));

                    if (!theCookie) {
                        return;
                    }

                    token = theCookie.split("=")[1]



                } else if (process.client) {
                    token = localStorage.getItem("easygenerator-token");
                    //expirationDate = localStorage.getItem("tokenExpiration");
                } else {
                    token = null;
                    //expirationDate = null;
                }

                context.commit("setToken", token);
            },
            logoutUser(context, req) {
                context.commit("clearToken");
                Cookie.remove('easygenerator-cookie')
                //Cookie.remove("expirationDate");
                if (process.client) {
                    localStorage.removeItem("easygenerator-token");
                    localStorage.removeItem("usr");
                }
            }
        },
        getters: {
            isAuthenticated(state) {
                return state.token != null
            },
            getToken(state) {
                return state.token
            },
            getUserInfo(state) {
                return state.userInfo
            }
        }
    });
};


export default createStore;