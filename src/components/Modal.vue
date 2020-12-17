<template>
  <div
    class="modal fade"
    id="userData"
    tabindex="-1"
    aria-labelledby="userDataLabel"
    aria-hidden="true"
    data-backdrop="static"
    data-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-info text-white">
          <h5 class="modal-title" id="userDataLabel">輸入資料</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="closeModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="displayName">姓名</label>
            <input type="text" v-model="user.displayName" disabled class="form-control" />
          </div>
          <div class="form-group">
            <label for="email">信箱</label>
            <input type="text" v-model="user.email" disabled class="form-control" />
          </div>
          <div class="form-group">
            <label for="uid">識別碼</label>
            <input type="text" v-model="user.uid" disabled class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click.prevent="closeModal"
          >
            取消
          </button>
          <button type="button" class="btn btn-info" @click.prevent="upload">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import $ from 'jquery';
import { db } from '@/db/firebase';

export default {
  methods: {
    closeModal() {
      this.$store.commit('SHOWMODAL', false);
    },
    async upload() {
      const payload = {};
      this.features.forEach((item, index) => {
        payload[index] = item;
      });
      try {
        this.$store.commit('ISLOADING', true);
        await db
          .ref('/users')
          .child(this.user.uid)
          .set({
            displayName: this.user.displayName,
            email: this.user.email,
            features: payload,
          });
        this.$store.commit('SHOWMODAL', false);
        this.$store.commit('ISLOADING', false);
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapState(['user', 'showModal', 'features']),
  },
  watch: {
    showModal(bool) {
      const status = bool ? 'show' : 'hide';
      $('#userData').modal(status);
    },
  },
};
</script>
