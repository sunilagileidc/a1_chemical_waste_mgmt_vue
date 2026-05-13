import { createStore } from "vuex";

import authModule from './modules/Auth/auth.js';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  plugins: [createPersistedState(
    {
      key:'authentication'
    }
  )],
  modules: {
    auth: authModule,
  },
  state() {
    return {};
  },
  getters: {},
  mutations: {},
  actions: {},
});

export default store;
