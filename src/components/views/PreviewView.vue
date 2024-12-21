<template>
  <div class="preview-view">
    <div class="preview-section">
      <h3>场景信息</h3>
      <div class="info-item">
        <span class="label">对象数量:</span>
        <span class="value">{{ objectCount }}</span>
      </div>
      <div class="info-item">
        <span class="label">相机位置:</span>
        <span class="value">{{ cameraPosition.join(', ') }}</span>
      </div>
      <div class="info-item">
        <span class="label">灯光数量:</span>
        <span class="value">{{ lightCount }}</span>
      </div>
    </div>
    <div class="preview-section">
      <h3>性能</h3>
      <div class="info-item">
        <span class="label">FPS:</span>
        <span class="value">{{ fps }}</span>
      </div>
      <div class="info-item">
        <span class="label">Draw calls:</span>
        <span class="value">{{ drawCalls }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const objectCount = ref(3)
const cameraPosition = ref([0, 5, -10])
const lightCount = ref(2)
const fps = ref(60)
const drawCalls = ref(24)
</script>

<style scoped>
.preview-view {
  padding: 16px;
}

.preview-section {
  margin-bottom: 24px;
}

h3 {
  font-size: 12px;
  color: #858585;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #2d2d2d;
}

.info-item:hover {
  background: #2a2d2e;
}

.label {
  color: #cccccc;
}

.value {
  color: #858585;
  font-family: 'Consolas', monospace;
}
</style>