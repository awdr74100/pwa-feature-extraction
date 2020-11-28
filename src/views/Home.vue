<template>
  <div class="container-fluid px-0">
    <loading :active="spinner.fullscreen" :is-full-page="true" :opacity="0.7">
      <slot name="default">
        <span class="h3"><i class="fas fa-spinner fa-spin text-info"></i></span>
      </slot>
    </loading>
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
      <div class="p-3 text-danger" v-if="!errorMessage">請在偵測到人臉時進行上傳！</div>
      <div class="mx-3 overlay d-flex align-items-center justify-content-center">
        <vue-web-cam
          id="webcam"
          ref="webcam"
          width="100%"
          height="100%"
          :deviceId="deviceId"
          @cameras="onCameras"
          @error="onError"
          @video-live="onVideoLive"
        />
      </div>
      <div class="px-3">
        <button
          class="btn btn-info my-3 d-flex align-items-center justify-content-center"
          @click.prevent="onCapture"
        >
          <span>特徵提取上傳</span>
          <i class="fas fa-spinner fa-spin text-white ml-3" v-if="spinner.icon"></i>
        </button>
      </div>
      <!-- <img v-for="(item, index) in base64" :key="index" :src="item" class="mt-3" alt="" /> -->
    </div>
    <Modal @callUpload="upload" />
  </div>
</template>

<script>
import delay from '@/utils/delay';
import * as faceapi from 'face-api.js';
import $ from 'jquery';

import Modal from '@/components/Modal.vue';
import db from '../db/firebase';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      deviceId: '',
      cameras: [],
      errorMessage: '',
      base64: [],
      float32array: [],
      spinner: { fullscreen: false, icon: false },
    };
  },
  methods: {
    async loadModel() {
      this.spinner.fullscreen = true;
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      ]);
    },
    onCameras(cameras) {
      this.cameras = cameras;
      this.deviceId = cameras[0].deviceId;
    },
    onError(error) {
      this.errorMessage = error;
    },
    async onVideoLive() {
      const webcam = document.querySelector('#webcam');
      const canvasDom = document.querySelector('canvas');
      const canvas = faceapi.createCanvasFromMedia(webcam);
      const canvasSize = { width: webcam.clientWidth, height: webcam.clientHeight };
      faceapi.matchDimensions(canvas, canvasSize);
      // reset canvas
      if (canvasDom) document.querySelector('.overlay').removeChild(canvasDom);
      document.querySelector('.overlay').appendChild(canvas);
      this.spinner.fullscreen = false;
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          webcam,
          new faceapi.TinyFaceDetectorOptions(),
        );
        const resizeDetections = faceapi.resizeResults(detections, canvasSize);
        canvas.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
        // faceapi.draw.drawDetections(canvas, resizeDetections);
        resizeDetections.forEach((detection) => {
          const { score } = detection;
          new faceapi.draw.DrawBox(
            {
              x: detection.box.x,
              y: detection.box.y,
              width: detection.box.width,
              height: detection.box.height,
            },
            { boxColor: '#17a2b8' },
          ).draw(canvas);
          new faceapi.draw.DrawTextField(
            [`${Math.ceil(score * 100) / 100}`],
            detection.box.bottomLeft,
            { backgroundColor: '#17a2b8' },
          ).draw(canvas);
        });
      }, 500);
    },
    async onCapture() {
      this.spinner.icon = true;
      this.base64 = [];
      this.float32array = [];
      const imageLength = 5;
      for (let i = 0; i < imageLength; i += 1) {
        this.base64.push(this.$refs.webcam.capture());
        // eslint-disable-next-line no-await-in-loop
        if (i !== imageLength - 1) await delay(500);
      }
      this.toFloat32Array();
    },
    async toFloat32Array() {
      const vm = this;
      const cache = [];
      vm.base64.forEach((item) => {
        const img = document.createElement('img');
        img.src = item;
        cache.push(
          faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor(),
        );
      });
      const float32array = await Promise.all(cache);
      this.float32array = float32array.map((item) => {
        if (item) return JSON.stringify(item.descriptor);
        return null;
      });
      this.spinner.icon = false;
      $('#userData').modal('show');
    },
    async upload({ studentId }) {
      const payload = {};
      this.float32array.forEach((item, index) => {
        payload[index] = item;
      });
      try {
        this.spinner.fullscreen = true;
        await db
          .ref('/members')
          .child(studentId)
          .set(payload);
        this.spinner.fullscreen = false;
        $('#userData').modal('hide');
      } catch (error) {
        this.errorMessage = error;
      }
    },
  },
  created() {
    this.loadModel();
  },
};
</script>
