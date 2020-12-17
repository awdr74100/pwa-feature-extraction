<template>
  <div class="container d-flex justify-content-center align-items-center vw-100 vh-100">
    <button
      class="btn btn-primary font-weight-bolder py-0 px-0 d-flex align-items-center"
      @click.prevent="signIn"
    >
      <div
        class="bg-white d-flex justify-content-center align-items-center text-danger"
        style="margin: 1px"
      >
        <span class="icon m-2"></span>
      </div>
      <span class="ml-3 mr-3">Sign in with Google</span>
    </button>
  </div>
</template>

<script>
import { auth, provider } from '@/db/firebase';

export default {
  methods: {
    signIn() {
      auth.signInWithRedirect(provider);
    },
    async authStateChange() {
      try {
        const { user } = await auth.getRedirectResult();
        if (!user) return;
        this.$store.commit('SETUSER', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
        this.$store.commit('ISSIGNIN', true);
        this.$router.push({ path: '/camera' });
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.authStateChange();
  },
};
</script>

<style lang="scss" scoped>
.icon {
  width: 24px;
  height: 24px;
  background-image: url('~@/assets/img/google.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
