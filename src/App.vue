<template>
  <div id="app">
    <Spinner />
    <Modal />
    <router-view></router-view>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import Modal from '@/components/Modal.vue';

export default {
  components: {
    Spinner,
    Modal,
  },
};
</script>

<style lang="scss">
@import '~@/assets/scss/all.scss';
</style>
