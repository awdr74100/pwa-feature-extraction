import Vue from 'vue';
import VueRouter from 'vue-router';
import SignIn from '@/views/SignIn.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/camera',
    name: 'Camera',
    meta: { requiresAuth: true },
    component: () => import('@/views/Camera.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) return next();
  if (router.app.$options.store.state.isSignIn) return next();
  return next('/');
});

export default router;
