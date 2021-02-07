<div align="center">
   <a href="https://jmaker-ac.netlify.app" title="JammeryHQ" target="_blank">
      <img src="https://raw.githubusercontent.com/awdr74100/pwa-feature-extraction/master/public/img/icons/android-chrome-512x512.png" alt="PetShop" width="100">
   </a>
   <h2>基於行動裝置人臉識別漸進式應用</h2>
</div>

基於 Vue.js + Face-API.js + Firebase + MediaDevices API 建構之人臉辨識系統，為先前 RFID 門禁系統延伸，成員可使用手機將自身臉部上傳至雲端，過程只單純提取臉部特徵，操作皆在運行裝置上完成；管理員可使用指定機子運行人臉辨識應用，過程一律透過 WebSocket 進行，自動同步雲端特徵並訓練至現有模型上。

[![Netlify Status](https://api.netlify.com/api/v1/badges/2a6e1a96-66a1-49b9-b24d-029d23575f4c/deploy-status)](https://app.netlify.com/sites/pwa-feature-extraction/deploys)

## 線上演示

- Extraction (Client)：https://pwa-feature-extraction.netlify.app/
- Recognition (Client)：https://pwa-face-recognition.netlify.app/
- Recognition (Repo)：https://github.com/awdr74100/pwa-face-recognition

## 應用介面

- Feature Extraction

<div align="center">
    <img src="https://i.imgur.com/JzOYlH3.jpg" width="240">
</div>

- Face Recognition

<div align="center">
    <img src="https://i.imgur.com/kCkmwm6.jpg" width="240">
</div>
