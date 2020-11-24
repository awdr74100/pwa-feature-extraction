<template>
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
      <div class="px-3">
        <vue-web-cam
          ref="webcam"
          :deviceId="deviceId"
          @cameras="onCameras"
          @started="onStarted"
          @stopped="onStopped"
          @error="onError"
          @camera-change="onCameraChange"
        />
      </div>
      <div class="px-3">
        <button
          class="btn btn-info"
          @click.prevent="onCapture"
          :disabled="!loaded.model || !loaded.camera"
        >
          提取
        </button>
      </div>
      <img v-for="(item, index) in base64" :key="index" :src="item" alt="" />
    </div>
  </div>
</template>

<script>
import delay from '@/utils/delay';
import * as faceapi from 'face-api.js';

export default {
  data() {
    return {
      deviceId: '',
      cameras: [],
      errorMessage: '',
      loaded: { model: false, camera: false },
      base64: [],
      float32Array: [],
    };
  },
  methods: {
    onCameras(cameras) {
      this.cameras = cameras;
      this.deviceId = cameras[0].deviceId;
      console.log(cameras); // 1
    },
    onStarted(stream) {
      this.loaded.camera = true;
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
    async onCapture() {
      this.base64.push(this.$refs.webcam.capture());
      await delay(500);
      this.base64.push(this.$refs.webcam.capture());
      await delay(500);
      this.base64.push(this.$refs.webcam.capture());
      await delay(500);
      this.base64.push(this.$refs.webcam.capture());
      await delay(500);
      this.base64.push(this.$refs.webcam.capture());
      this.toFloat32Array();
    },
    async toFloat32Array() {
      const vm = this;
      const cache = await Promise.all(
        vm.base64.map(async (item) => {
          const img = document.createElement('img');
          img.src = item;
          const { descriptor } = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          return JSON.stringify(descriptor);
        }),
      );
      this.float32Array = cache;
    },
    async loadModel() {
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      ]);
      this.loaded.model = true;
    },
  },
  async created() {
    this.loadModel();
  },
};
</script>
