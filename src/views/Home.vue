<template>
  <!-- <div class="container-fluid px-0">
    <div class="row no-gutters align-items-center justify-content-center">
      <select v-model="camera">
        <option value="" disabled>-- Select Device --</option>
        <option v-for="device in devices" :key="device.deviceId" :value="device.deviceId">{{
          device.label
        }}</option>
      </select>
    </div>
    <div class="row no-gutters align-items-center justify-content-center my-3">
      <button class="btn btn-primary" @click.prevent="onCapture">開始</button>
    </div>
    <div class="row no-gutters align-items-center justify-content-center">
      <vue-web-cam
        v-if="showCamera"
        ref="webcam"
        width="100%"
        :device-id="deviceId"
        @started="onStarted"
        @stopped="onStopped"
        @error="onError"
        @cameras="onCameras"
        @camera-change="onCameraChange"
      />
    </div>
    <img :src="base64" alt="">
  </div> -->
  <div class="container-fluid px-0">
    <div class="d-flex flex-column align-items-center justify-content-center">
      <div class="p-3 w-100">
        <select class="form-control" v-model="deviceId">
          <option value="" disabled>-- Select Camera --</option>
          <option v-for="camera in cameras" :key="camera.deviceId" :value="camera.deviceId">{{
            camera.label
          }}</option>
        </select>
      </div>
      <div class="p-3" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <div class="">
        <vue-web-cam
          :deviceId="deviceId"
          @cameras="onCameras"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @camera-change="onCameraChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceId: '',
      cameras: [],
      errorMessage: '',
    };
  },
  methods: {
    onCameras(cameras) {
      this.cameras = cameras;
      this.deviceId = cameras[0].deviceId;
      console.log(cameras); // 1
    },
    onStarted(stream) {
      console.log('已開始', stream); // 3
    },
    onStopped(stream) {
      console.log('已結束', stream);
    },
    onError(error) {
      this.errorMessage = error;
    },
    onCameraChange(deviceId) {
      console.log(deviceId); // 2
    },
  },
  // created() {
  //   setTimeout(() => {
  //     this.showCamera = true;
  //   }, 0);
  // },
  // data() {
  //   return {
  //     base64: '',
  //     showCamera: false,
  //     camera: '',
  //     deviceId: '',
  //     devices: [],
  //   };
  // },
  // methods: {
  //   onStarted(stream) {
  //     console.log('On Started Event', stream);
  //   },
  //   onStopped(stream) {
  //     console.log('On Stopped Event', stream);
  //   },
  //   onCameras(cameras) {
  //     this.devices = cameras;
  //     console.log('On Cameras Event', cameras);
  //   },
  //   onCameraChange(deviceId) {
  //     this.deviceId = deviceId;
  //     this.camera = deviceId;
  //     console.log('On Camera Change Event', deviceId);
  //   },
  //   onError(error) {
  //     console.log('On Error Event', error);
  //   },
  //   onCapture() {
  //     this.base64 = this.$refs.webcam.capture();
  //     console.log('active');
  //     // console.log(this.$refs.webcam.capture());
  //   },
  // },
  // watch: {
  //   camera(id) {
  //     this.deviceId = id;
  //   },
  //   devices() {
  //     // Once we have a list select the first one
  //     // console.log(this.devices);
  //     // eslint-disable-next-line no-unused-vars
  //     const [first, ...tail] = this.devices;
  //     if (first) {
  //       this.camera = first.deviceId;
  //       this.deviceId = first.deviceId;
  //     }
  //   },
  // },
};
</script>
