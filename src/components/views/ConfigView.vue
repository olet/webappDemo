<template>
  <div class="config-view">
    <div class="config-section">
      <h3>场景配置</h3>
      <div class="config-item">
        <pre class="code">
{
  "scene": {
    "gravity": [0, -9.81, 0],
    "ambientColor": "#232323",
    "fogEnabled": false
  },
  "camera": {
    "type": "free",
    "position": [0, 5, -10],
    "target": [0, 0, 0]
  },
  "lights": [
    {
      "type": "hemispheric",
      "direction": [0, 1, 0],
      "intensity": 1
    }
  ]
}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可以添加配置数据
import { ref } from 'vue'

const config = ref({
  scene: {
    gravity: [0, -9.81, 0],
    ambientColor: "#232323",
    fogEnabled: false
  },
  camera: {
    type: "free",
    position: [0, 5, -10],
    target: [0, 0, 0]
  },
  lights: [
    {
      type: "hemispheric",
      direction: [0, 1, 0],
      intensity: 1
    }
  ]
})
</script>

<style scoped>
.config-view {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

h3 {
  font-size: 12px;
  color: #858585;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.config-item {
  background: #1e1e1e;
  border-radius: 4px;
  overflow: auto;
}

.code {
  font-family: 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #d4d4d4;
  padding: 12px;
  margin: 0;
}
</style>