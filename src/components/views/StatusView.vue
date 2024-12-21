<template>
  <div class="status-view">
    <div class="status-group">
      <div class="status-item">
        <span class="label">FPS:</span>
        <span class="value">60</span>
      </div>
      <div class="status-item">
        <span class="label">内存:</span>
        <span class="value">128MB</span>
      </div>
      <div class="status-item">
        <span class="label">渲染时间:</span>
        <span class="value">16.7ms</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-view {
  padding: 8px;
}

.status-group {
  display: flex;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #858585;
}

.value {
  color: #cccccc;
  font-family: 'Consolas', monospace;
}
</style> 