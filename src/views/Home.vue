<template>
  <div class="container-fluid px-0">
    <loading :active="!loaded.model || !loaded.camera" :is-full-page="true"></loading>
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
      <div class="mx-3 overlay d-flex align-items-center justify-content-center">
        <vue-web-cam
          id="webcam"
          ref="webcam"
          width="100%"
          height="100%"
          :deviceId="deviceId"
          @cameras="onCameras"
          @started="onStarted"
          @error="onError"
          @video-live="onVideoLive"
        />
      </div>
      <div class="px-3">
        <button
          class="btn btn-info mt-3"
          @click.prevent="onCapture"
          :disabled="!loaded.model || !loaded.camera"
        >
          提取特徵上傳
        </button>
      </div>
      <img v-for="(item, index) in base64" :key="index" :src="item" class="mt-3" alt="" />
    </div>
    <Modal @callUpload="upload" />
  </div>
</template>

<script>
// import delay from '@/utils/delay';
import * as faceapi from 'face-api.js';
import $ from 'jquery';

import Modal from '@/components/Modal.vue';
import { db } from '@/plugins/firebase';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      deviceId: '',
      cameras: [],
      errorMessage: '',
      loaded: { model: false, camera: false },
      base64: [],
      float32array: [],
    };
  },
  methods: {
    async loadModel() {
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      ]);
      this.loaded.model = true;
    },
    onCameras(cameras) {
      this.cameras = cameras;
      this.deviceId = cameras[0].deviceId;
    },
    onStarted() {
      this.loaded.camera = true;
    },
    onError(error) {
      this.errorMessage = error;
    },
    async onVideoLive() {
      const webcam = document.querySelector('#webcam');
      const canvas = faceapi.createCanvasFromMedia(webcam);
      const canvasSize = { width: webcam.clientWidth, height: webcam.clientHeight };
      faceapi.matchDimensions(canvas, canvasSize);
      document.querySelector('.overlay').appendChild(canvas);
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          webcam,
          new faceapi.TinyFaceDetectorOptions(),
        );
        const resizeDetections = faceapi.resizeResults(detections, canvasSize);
        canvas.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
        faceapi.draw.drawDetections(canvas, resizeDetections);
      }, 500);
    },
    async onCapture() {
      db.ref('/').push('Hello World');
      // this.base64 = [];
      // this.float32array = [];
      // this.base64.push(this.$refs.webcam.capture());
      // await delay(500);
      // this.base64.push(this.$refs.webcam.capture());
      // await delay(500);
      // this.base64.push(this.$refs.webcam.capture());
      // await delay(500);
      // this.base64.push(this.$refs.webcam.capture());
      // await delay(500);
      // this.base64.push(this.$refs.webcam.capture());
      // this.toFloat32Array();
    },
    async toFloat32Array() {
      const vm = this;
      const float32array = await Promise.all(
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
      this.float32array = float32array;
      $('#userData').modal('show');
    },
    async upload({ studentId }) {
      console.log(studentId);
      console.log(this.float32array);
      $('#userData').modal('hide');
    },
  },
  created() {
    this.loadModel();
  },
};
</script>
