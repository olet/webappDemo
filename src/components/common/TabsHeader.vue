<template>
  <div class="tabs-header">
    <div class="tabs-list" @wheel.prevent="handleWheel">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: tab.id === activeTab }"
        @click="$emit('tab-click', tab.id)"
      >
        <span class="tab-title">{{ tab.title }}</span>
        <button 
          v-if="tab.closable && showCloseButton" 
          class="tab-close" 
          @click.stop="$emit('tab-close', tab.id)"
        >✕</button>
      </div>
      <div v-if="showAddButton" class="tab add-tab" @click="$emit('tab-add')">
        <span class="add-icon">+</span>
      </div>
    </div>
    <div class="tabs-actions" v-if="$slots.actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string
  title: string
  closable?: boolean
}

defineProps<{
  tabs: Tab[]
  activeTab: string
  showAddButton?: boolean
  showCloseButton?: boolean
}>()

defineEmits<{
  'tab-click': [id: string]
  'tab-close': [id: string]
  'tab-add': []
}>()

// 处理鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  const tabsList = e.currentTarget as HTMLElement
  // 使用 deltaY 来水平滚动（deltaY 是垂直滚动量）
  tabsList.scrollLeft += e.deltaY
}
</script>

<style scoped>
.tabs-header {
  height: 35px;
  background: #252526;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1e1e1e;
}

.tabs-list {
  display: flex;
  height: 100%;
  overflow-x: auto;  /* 允许水平滚动 */
  overflow-y: hidden;  /* 隐藏垂直滚动条 */
  flex-wrap: nowrap;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scroll-behavior: smooth;  /* 平滑滚动 */
}

/* 隐藏 Webkit 滚动条 */
.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab {
  height: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2d2d2d;
  border-right: 1px solid #1e1e1e;
  cursor: pointer;
  min-width: 40px;
  max-width: 60px;
}

.tab:hover {
  background: #2a2a2a;
}

.tab.active {
  background: #1e1e1e;
  position: relative;
}

.tab.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #007acc;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: #1e1e1e;
}

.tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-size: 13px;
  color: #969696;
  min-width: 0;
  padding-right: 4px;
}

.tab.active .tab-title {
  color: #ffffff;
}

.tab-close {
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  color: #969696;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tab:hover .tab-close,
.tab.active .tab-close {
  opacity: 0.7;
}

.tab-close:hover {
  opacity: 1;
  background: #404040;
}

.tabs-actions {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  border-left: 1px solid #1e1e1e;
}

.add-tab {
  min-width: 40px !important;
  justify-content: center;
  padding: 0;
}

.add-icon {
  font-size: 20px;
  color: #969696;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.add-tab:hover .add-icon {
  color: #ffffff;
}

/* 添加渐变阴影提示可滚动 */
.tabs-list::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 30px;
  background: linear-gradient(to right, transparent, rgba(45, 45, 45, 0.8));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.tabs-list:not([data-scroll-end="true"])::after {
  opacity: 1;
}
</style> 