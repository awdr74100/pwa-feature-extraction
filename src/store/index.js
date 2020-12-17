import Vue from 'vue';
import Vuex from 'vuex';
import $ from 'jquery';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state: {
    isSignIn: false,
    isLoading: false,
    loadingStatus: '',
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
      $('#userData').modal(status ? 'show' : 'hide');
    },
    SETLOADINGSTATUS(state, status) {
      state.loadingStatus = status;
    },
  },
  getters: {},
});
