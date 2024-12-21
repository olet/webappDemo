<template>
  <div class="explorer-view">
    <div class="section">
      <h3>打开的编辑器</h3>
      <div class="item" @click="onItemClick('scene.json')">
        scene.json
      </div>
      <div class="item">config.ts</div>
    </div>
    <div class="section">
      <h3>项目文件</h3>
      <div class="item">📁 src</div>
      <div class="item">📁 assets</div>
      <div class="item">📄 package.json</div>
    </div>
  </div>
</template>

<style scoped>
.explorer-view {
  padding: 10px;
}

.section {
  margin-bottom: 20px;
}

h3 {
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #858585;
}

.item {
  padding: 4px 8px;
  cursor: pointer;
}

.item:hover {
  background: #2a2d2e;
}
</style>

<script setup lang="ts">
const onItemClick = (path: string) => {
  console.log('Open file:', path)
}
</script> 