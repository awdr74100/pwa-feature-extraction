import Vue from 'vue';
import { WebCam } from 'vue-web-cam';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.component('vue-web-cam', WebCam);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
