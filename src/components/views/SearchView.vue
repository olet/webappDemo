<template>
  <div class="search-view">
    <div class="search-input">
      <n-input
        v-model:value="searchText"
        placeholder="搜索文件或内容"
        clearable
      >
        <template #prefix>
          🔍
        </template>
      </n-input>
    </div>
    <div class="search-results">
      <div class="result-item">
        <div class="file">📄 scene.json</div>
        <div class="match">"camera": { "position": [0, 5, -10] }</div>
      </div>
      <div class="result-item">
        <div class="file">📄 config.ts</div>
        <div class="match">export const GRID_SIZE = 10;</div>
      </div>
      <div class="result-item">
        <div class="file">📄 App.vue</div>
        <div class="match">const camera = new Camera()</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NInput } from 'naive-ui'

const searchText = ref('')
const results = ref([])

const onSearch = () => {
  // 搜索逻辑示例
  console.log('Searching for:', searchText.value)
}
</script>

<style scoped>
.search-view {
  padding: 16px;
}

.search-input {
  margin-bottom: 16px;
}

.result-item {
  padding: 8px;
  border-bottom: 1px solid #2d2d2d;
  cursor: pointer;
}

.result-item:hover {
  background: #2a2d2e;
}

.file {
  color: #858585;
  font-size: 12px;
  margin-bottom: 4px;
}

.match {
  color: #cccccc;
  font-size: 12px;
  font-family: 'Consolas', monospace;
  padding-left: 16px;
}
</style> 