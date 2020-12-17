import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state: {
    isSignIn: false,
    isLoading: false,
    showModal: false,
    user: {
      uid: '',
      displayName: '',
      email: '',
    },
    features: [],
  },
  actions: {},
  mutations: {
    SETUSER(state, { uid, displayName, email }) {
      state.user.uid = uid;
      state.user.displayName = displayName;
      state.user.email = email;
    },
    ISSIGNIN(state, status) {
      state.isSignIn = status;
    },
    ISLOADING(state, status) {
      state.isLoading = status;
    },
    SETFEATURES(state, features) {
      state.features = features;
    },
    SHOWMODAL(state, status) {
      state.showModal = status;
    },
  },
  getters: {},
});
