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
      <div class="p-3 text-danger" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="p-3 text-danger" v-if="!errorMessage">請在人臉檢測框為綠色時進行提取！</div>
      <div class="mx-3 overlay d-flex align-items-center justify-content-center">
        <vue-web-cam
          id="webcam"
          ref="webcam"
          width="100%"
          height="100%"
          :deviceId="deviceId"
          @cameras="onCameras"
          @camera-change="onCameraChange"
          @error="onError"
          @notsupported="onError"
          @video-live="onVideoLive"
        />
      </div>
      <div class="px-3">
        <button
          class="btn btn-teal my-3 d-flex align-items-center justify-content-center"
          @click.prevent="onCapture"
        >
          <span>提取特徵</span>
          <i class="fas fa-spinner fa-spin text-white ml-3" v-if="spinner"></i>
        </button>
      </div>
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
      spinner: false,
      loadedModels: false,
    };
  },
  methods: {
    async onVideoLive() {
      // load model
      if (!this.loadedModels) await this.loadModels();
      const webcam = document.querySelector('#webcam');
      const canvasDom = document.querySelector('canvas');
      const canvas = faceapi.createCanvasFromMedia(webcam);
      const canvasSize = { width: webcam.clientWidth, height: webcam.clientHeight };
      faceapi.matchDimensions(canvas, canvasSize);
      // clear canvas
      if (canvasDom) document.querySelector('.overlay').removeChild(canvasDom);
      document.querySelector('.overlay').appendChild(canvas);
      // close spinner loading
      this.$store.commit('ISLOADING', false);
      // face detection
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          webcam,
          new faceapi.TinyFaceDetectorOptions(),
        );
        const resizeDetections = faceapi.resizeResults(detections, canvasSize);
        canvas.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
        resizeDetections.forEach((detection) => {
          const score = Math.ceil(detection.score * 100) / 100;
          new faceapi.draw.DrawBox(
            {
              x: detection.box.x,
              y: detection.box.y,
              width: detection.box.width,
              height: detection.box.height,
            },
            { boxColor: score > 0.85 ? '#20c997' : '#6c757d' },
          ).draw(canvas);
          new faceapi.draw.DrawTextField([`${score}`], detection.box.bottomLeft, {
            backgroundColor: score > 0.85 ? '#20c997' : '#6c757d',
          }).draw(canvas);
        });
      }, 500);
    },
    async onCapture() {
      const vm = this;
      const base64Array = [];
      const imageLength = 5;
      vm.$store.commit('SETFEATURES', []);
      vm.spinner = true;
      for (let i = 0; i < imageLength; i += 1) {
        base64Array.push(vm.$refs.webcam.capture());
        // eslint-disable-next-line no-await-in-loop
        if (i !== imageLength - 1) await delay(500);
      }
      const features = await Promise.all(
        base64Array.map((base64) => {
          const img = document.createElement('img');
          img.src = base64;
          return faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
        }),
      );
      const featuresStringify = features.map((item) => {
        if (item) return JSON.stringify(item.descriptor);
        return null;
      });
      vm.$store.commit('SETFEATURES', featuresStringify);
      vm.spinner = false;
      vm.$store.commit('SHOWMODAL', true);
    },
    onCameras(cameras) {
      this.cameras = cameras;
      this.deviceId = cameras[0].deviceId;
    },
    onCameraChange() {
      this.$store.commit('SETLOADINGSTATUS', '相機啟動中');
      this.$store.commit('ISLOADING', true);
    },
    onError(error) {
      this.errorMessage = error;
      this.$store.commit('ISLOADING', false);
    },
    async loadModels() {
      this.$store.commit('SETLOADINGSTATUS', '模型載入中');
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      ]);
      this.loadedModels = true;
      return Promise.resolve();
    },
  },
  created() {
    this.$store.commit('SETLOADINGSTATUS', '相機啟動中');
    this.$store.commit('ISLOADING', true);
  },
};
</script>
