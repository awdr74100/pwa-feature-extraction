<template>
  <div
    class="modal fade"
    id="userData"
    tabindex="-1"
    aria-labelledby="userDataLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-info text-white">
          <h5 class="modal-title" id="userDataLabel">輸入資料</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="studentId">學號</label>
            <input type="text" v-model="studentId" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-info" @click.prevent="upload">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentId: '',
    };
  },
  methods: {
    upload() {
      this.$emit('callUpload', { studentId: this.studentId });
      this.studentId = '';
    },
  },
};
</script>
