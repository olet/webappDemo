<template>
  <div class="settings-view">
    <div class="settings-group">
      <h3>编辑器</h3>
      <div class="setting-item">
        <div class="setting-title">字体大小</div>
        <div class="setting-value">14px</div>
      </div>
      <div class="setting-item">
        <div class="setting-title">制表符大小</div>
        <div class="setting-value">2</div>
      </div>
    </div>
    <div class="settings-group">
      <h3>3D场景</h3>
      <div class="setting-item">
        <div class="setting-title">网格大小</div>
        <div class="setting-value">1</div>
      </div>
      <div class="setting-item">
        <div class="setting-title">背景颜色</div>
        <div class="setting-value">#1e1e1e</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 10px;
}

.settings-group {
  margin-bottom: 20px;
}

h3 {
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #858585;
}

.setting-item {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-title {
  color: #cccccc;
}

.setting-value {
  color: #858585;
}

.setting-item:hover {
  background: #2a2d2e;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const fontSize = ref(14)
const tabSize = ref(2)

const updateSetting = (key: string, value: any) => {
  // 实现设置更新逻辑
}
</script> 