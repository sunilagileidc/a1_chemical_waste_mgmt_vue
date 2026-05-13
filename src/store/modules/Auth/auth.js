import axios from "axios";
import localStorageWrapper from "../../../localStorageWrapper.js";
const state = {
  isAuthenticated: false,
  userData: null,
  loggedIn: true,
};

const getters = {
  user: (state) => state.userData,
  authentication: (state) => state.isAuthenticated,
  loggedin: (state) => state.loggedIn,
};

const mutations = {
  setAuthentication(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  setUserData(state, user) {
    state.userData = user;
  },
  storeImageUrl(state, url) {
    state.ImageFullUrl = url;
  },
  updateLoggedIn(state) {
    state.loggedIn = false;
  },
};

const actions = {
  loginRequest({ commit }, data) {
    // commit("setErrors", {}, { root: true });

    return axios
      .post(import.meta.env.VITE_API_URL_ADMIN + "login", data)
      .then((res) => {
        console.log('inside res');
        console.log(res);
        if (res.data.status == "S") {
          console.log(res.data.user);
          commit("setUserData", res.data.user);
          commit("setAuthentication", true);
          // const parsedUserData = JSON.stringify(res.data.userdata);
          console.log('res.data.user');
          console.log(res.data.user);
          localStorageWrapper.setItem("access_token", res.data.access_token);
          localStorageWrapper.setItem("user_data", JSON.stringify(res.data.user));
          setTimeout(() => {
            commit("updateLoggedIn");
          }, 3000);
        }else{
          return res.data;
        }
      })
      // .catch((error) => {
      //   console.log(error);
      // });
  },

  logoutUser({ commit }) {
    localStorage.clear();
    commit("setAuthentication", false);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
