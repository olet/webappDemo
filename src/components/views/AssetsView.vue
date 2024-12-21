<template>
  <div class="assets-view">
    <div class="assets-list">
      <div class="asset-item">
        <div class="asset-preview">📦</div>
        <div class="asset-info">
          <div class="asset-name">Box</div>
          <div class="asset-type">Mesh</div>
        </div>
      </div>
      <div class="asset-item">
        <div class="asset-preview">💡</div>
        <div class="asset-info">
          <div class="asset-name">Light</div>
          <div class="asset-type">DirectionalLight</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assets-view {
  padding: 8px;
}

.assets-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.asset-item {
  width: 100px;
  background: #2d2d2d;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
}

.asset-item:hover {
  background: #3d3d3d;
}

.asset-preview {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.asset-info {
  text-align: center;
}

.asset-name {
  color: #cccccc;
  font-size: 12px;
}

.asset-type {
  color: #858585;
  font-size: 10px;
}
</style> 