<template>
  <loading :active="isLoading" :is-full-page="true" :opacity="0.7">
    <slot name="default">
      <span class="h3"><i class="fas fa-spinner fa-spin text-info"></i></span>
    </slot>
  </loading>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['isLoading']),
  },
};
</script>
