<template>
  <div class="layout-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="menu-items">
        <span>文件</span>
        <span>编辑</span>
        <span>视图</span>
        <span>帮助</span>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧活动栏 -->
      <div class="activity-bar">
        <div 
          class="action-item" 
          :class="{ active: currentView === 'explorer' }" 
          @click="toggleView('explorer')"
          title="资源管理器"
        >
          <i class="icon">📁</i>
          <div class="action-label">资源管理器</div>
        </div>
        <div 
          class="action-item" 
          :class="{ active: currentView === 'search' }" 
          @click="toggleView('search')"
          title="搜索"
        >
          <i class="icon">🔍</i>
          <div class="action-label">搜索</div>
        </div>
        <div 
          class="action-item" 
          :class="{ active: currentView === 'settings' }" 
          @click="toggleView('settings')"
          title="设置"
        >
          <i class="icon">⚙️</i>
          <div class="action-label">设置</div>
        </div>
      </div>

      <!-- 三列布局 -->
      <Splitpanes class="default-theme" style="flex: 1; position: relative;">
        <!-- 左侧资源管理器 - 固定尺寸 -->
        <Pane :size="10" :min-size="10" :max-size="15">
          <div class="panel">
            <!-- 根据当前视图显示不同的内容 -->
            <div v-show="currentView === 'explorer'">
              <TabsHeader
                :tabs="explorerTabs"
                :active-tab="activeExplorerTab"
                @tab-click="activeExplorerTab = $event"
              />
              <div class="panel-content">
                <div class="panel-content-scrollable">
                  <component :is="getExplorerComponent(activeExplorerTab)"></component>
                </div>
              </div>
            </div>

            <div v-show="currentView === 'search'">
              <SearchView />
            </div>

            <div v-show="currentView === 'settings'">
              <SettingsView />
            </div>
          </div>
        </Pane>

        <!-- 中间场景 -->
        <Pane class="flex-auto" style="position: relative;">
          <div class="panel">
            <!-- 上部分：3D场景和其他视图 -->
            <div class="scene-section">
              <TabsHeader
                :tabs="sceneTabs"
                :active-tab="activeSceneTab"
                :show-add-button="true"
                :show-close-button="true"
                @tab-click="handleSceneTabChange"
                @tab-close="handleSceneTabClose"
                @tab-add="handleSceneTabAdd"
              />
              <div class="panel-content">
                <div class="panel-content-scrollable">
                  <div v-show="activeSceneTab === 'scene'" class="scene-container">
                    <slot></slot>
                  </div>
                  <div v-show="activeSceneTab !== 'scene'">
                    <component :is="getSceneComponent(activeSceneTab)" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 下部分：状态和资产 -->
            <div class="bottom-section">
              <TabsHeader
                :tabs="bottomTabs"
                :active-tab="activeBottomTab"
                @tab-click="activeBottomTab = $event"
              />
              <div class="panel-content">
                <div class="panel-content-scrollable">
                  <component :is="getBottomComponent(activeBottomTab)" />
                </div>
              </div>
            </div>
          </div>
        </Pane>

        <!-- 右侧编辑器 - 固定尺寸 -->
        <Pane v-show="showEditor" :size="15" :min-size="15" :max-size="20">
          <div class="panel">
            <TabsHeader
              :tabs="editorTabs"
              :active-tab="activeEditorTab"
              :show-add-button="true"
              @tab-click="activeEditorTab = $event"
              @tab-close="closeEditorTab"
              @tab-add="addEditorTab"
            >
              <template #actions>
                <button class="panel-action" @click="toggleEditor">✕</button>
              </template>
            </TabsHeader>
            <div class="panel-content">
              <ObjectEditor 
                v-if="selectedObject || activeEditorTab === 'config.ts'"
                ref="objectEditorRef"
                :active-tab="activeEditorTab"
                @update="updateObject"
              />
              <div v-else class="no-selection">
                未选中任何对象
              </div>
            </div>
          </div>
        </Pane>
      </Splitpanes>
    </div>

    <!-- 底部状态栏 -->
    <div class="statusbar">
      <span>Ready</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import TabsHeader from '@/components/common/TabsHeader.vue'
import 'splitpanes/dist/splitpanes.css'
import '@/styles/layout.css'
import '@/styles/panels.css'
import '@/styles/editor.css'
import ExplorerView from '@/components/views/ExplorerView.vue'
import SearchView from '@/components/views/SearchView.vue'
import SettingsView from '@/components/views/SettingsView.vue'
import ObjectEditor from '@/components/editor/ObjectEditor.vue'
import PreviewView from '@/components/views/PreviewView.vue'
import ConfigView from '@/components/views/ConfigView.vue'
import StatusView from '@/components/views/StatusView.vue'
import AssetsView from '@/components/views/AssetsView.vue'

const currentView = ref('explorer')
const showEditor = ref(true)

const toggleView = (view: string) => {
  currentView.value = view
  // 重置对应的标签页
  switch (view) {
    case 'explorer':
      activeExplorerTab.value = 'files'
      break
    case 'search':
      // 可以重置搜索状态
      break
    case 'settings':
      // 可以重置设置状态
      break
  }
}

const toggleEditor = () => {
  showEditor.value = !showEditor.value
}

const closeEditorTab = (tabId: string) => {
  const index = editorTabs.value.findIndex(tab => tab.id === tabId)
  if (index > -1) {
    editorTabs.value.splice(index, 1)
    if (activeEditorTab.value === tabId) {
      activeEditorTab.value = editorTabs.value[0]?.id || ''
    }
    if (editorTabs.value.length === 0) {
      showEditor.value = false
    }
  }
}

const addEditorTab = () => {
  const newTabId = `newFile${editorTabs.value.length + 1}.ts`
  editorTabs.value.push({
    id: newTabId,
    title: newTabId,
    closable: true
  })
  activeEditorTab.value = newTabId
}

const getCurrentEditorContent = () => {
  // 这可以根据 activeEditorTab 返回不同的内容
  return activeEditorTab.value === 'scene.json' 
    ? JSON.stringify({
        scene: {
          camera: {
            position: [0, 5, -10],
            target: [0, 0, 0]
          },
          objects: [
            {
              type: "box",
              size: 2
            }
          ]
        }
      }, null, 2)
    : '// 配置文件内容'
}

// 源管理器标签页
const explorerTabs = ref([
  { id: 'files', title: '文件' },
  { id: 'search', title: '搜索' }
])
const activeExplorerTab = ref('files')

// 场景标签页
const sceneTabs = ref([
  { id: 'scene', title: '3D场景', closable: false },  // 主场景不可关闭
  { id: 'preview', title: '预览', closable: true },
  { id: 'config', title: '配置', closable: true }
])
const activeSceneTab = ref('scene')

// 编辑器标签页
const editorTabs = ref([
  { id: 'scene.json', title: 'scene.json', closable: true },
  { id: 'config.ts', title: 'config.ts', closable: true }
])
const activeEditorTab = ref('scene.json')

// 添加对 splitpanes 的引用
const splitpanesRef = ref(null)

const currentViewComponent = computed(() => {
  switch (currentView.value) {
    case 'explorer':
      return ExplorerView
    case 'search':
      return SearchView
    case 'settings':
      return SettingsView
    case 'preview':
      return PreviewView
    case 'config':
      return ConfigView
    default:
      return ExplorerView
  }
})

const selectedObject = ref(null)
const objectEditorRef = ref(null)

// 当场景中选中对象时调用
const onObjectSelected = (object: any) => {
  selectedObject.value = object
  // 更新表单
  if (objectEditorRef.value) {
    if (object) {
      objectEditorRef.value.updateForm({
        name: object.name,
        position: object.position,
        rotation: object.rotation,
        scale: object.scale,
        material: {
          color: object.material.color,
          opacity: object.material.opacity
        }
      })
    } else {
      // 清空选中状态
      selectedObject.value = null
    }
  }
}

// 当表单更新时调用
const updateObject = (value: any) => {
  if (selectedObject.value) {
    // 更新场景中的对象
    Object.assign(selectedObject.value.position, value.position)
    Object.assign(selectedObject.value.rotation, value.rotation)
    Object.assign(selectedObject.value.scale, value.scale)
    selectedObject.value.material.color = value.material.color
    selectedObject.value.material.opacity = value.material.opacity
  }
}

// 暴露给父组件的方法
defineExpose({
  onObjectSelected,
  activeSceneTab
})

// 获取中间区域的组件
const getSceneComponent = (tab: string) => {
  switch (tab) {
    case 'preview':
      return PreviewView
    case 'config':
      return ConfigView
    default:
      return null
  }
}

// 获取资源管理器的组件
const getExplorerComponent = (tab: string) => {
  switch (tab) {
    case 'files':
      return ExplorerView
    case 'search':
      return SearchView
    default:
      return null
  }
}

// 添加 emit 定义
const emit = defineEmits<{
  (e: 'scene-tab-change', tab: string): void
}>()

// 处理场景标签页切换
const handleSceneTabChange = (tab: string) => {
  activeSceneTab.value = tab
  emit('scene-tab-change', tab)
}

// 添加底部标签页状态
const bottomTabs = ref([
  { id: 'status', title: '状态' },
  { id: 'assets', title: '资产' }
])
const activeBottomTab = ref('status')

// 添加获取底部组件的方法
const getBottomComponent = (tab: string) => {
  switch (tab) {
    case 'status':
      return StatusView
    case 'assets':
      return AssetsView
    default:
      return null
  }
}

// 处理场景标签页关闭
const handleSceneTabClose = (tabId: string) => {
  // 不允许关闭主场景
  if (tabId === 'scene') return

  const index = sceneTabs.value.findIndex(tab => tab.id === tabId)
  if (index > -1) {
    sceneTabs.value.splice(index, 1)
    // 如果关闭的是当前标签，切换到主场景
    if (activeSceneTab.value === tabId) {
      activeSceneTab.value = 'scene'
    }
  }
}

// 处理添加新场景标签页
const handleSceneTabAdd = () => {
  const newTabId = `scene${sceneTabs.value.length + 1}`
  sceneTabs.value.push({
    id: newTabId,
    title: `场景${sceneTabs.value.length + 1}`,
    closable: true
  })
  activeSceneTab.value = newTabId
}
</script>

<style>
.splitpanes {
  width: 100%;
  height: 100%;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.splitpanes__pane {
  transition: none !important;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

.splitpanes__pane[style*="display: none"] {
  position: absolute !important;
  visibility: hidden !important;
  pointer-events: none !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

.splitpanes__splitter {
  transition: none !important;
  min-width: 1px !important;
  margin: 0;
  border: none;
  position: relative;
  z-index: 1;
  transform: translateZ(0);
}

.splitpanes.default-theme .splitpanes__pane {
  background: transparent;
  border: none;
}

.panel {
  height: 100%;
  background: #252526;
  display: flex;
  flex-direction: column;
  position: relative;
  transform: translateZ(0);
  border: none;
}

.panel-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-content-scrollable {
  flex: 1;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: #424242 #1e1e1e;
}

.panel-content-scrollable::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.panel-content-scrollable::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.panel-content-scrollable::-webkit-scrollbar-thumb {
  background-color: #424242;
  border-radius: 4px;
}

.panel-content-scrollable::-webkit-scrollbar-thumb:hover {
  background-color: #4f4f4f;
}

.panel-action {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 4px 8px;
}

.panel-action:hover {
  background: #404040;
}

/* 让中间面板自动填充剩余空间 */
.flex-auto {
  flex: 1 1 auto !important;
}

/* 覆盖 splitpanes 默认样式 */
.splitpanes.default-theme .splitpanes__splitter {
  background-color: #333333 !important;
  width: 1px !important;
  min-width: 1px !important;
  max-width: 1px !important;
  margin: 0 !important;
  border: none !important;
  position: relative;
  z-index: 1;
  transform: translateZ(0);
}

/* 移除所有可能的边框和额外空间 */
.splitpanes.default-theme .splitpanes__pane {
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.toolbar {
  height: 30px;
  background: #333333;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #252525;
  font-size: 12px; /* 减小字体大小 */
}

.menu-items {
  display: flex;
  gap: 15px;
  color: #cccccc; /* 降低文字对比度 */
  font-weight: normal; /* 确保字体不会加粗 */
}

.menu-items span {
  cursor: pointer;
  padding: 0 5px;
  opacity: 0.8; /* 稍微降低不活跃状态的透明度 */
}

.menu-items span:hover {
  opacity: 1;
}

.activity-bar {
  width: 48px;
  background: #333333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  flex-shrink: 0;
  position: relative;
}

.action-item {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  color: #858585;
  transition: color 0.2s;
}

.action-item:hover {
  color: #ffffff;
}

.action-item.active {
  color: #ffffff;
}

.action-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #007acc;
}

.action-label {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #252526;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  display: none;
  z-index: 1000;
}

.action-item:hover .action-label {
  display: block;
}

.no-selection {
  padding: 16px;
  text-align: center;
  color: #666;
}

/* 添加视图容器样式 */
.scene-view,
.preview-view,
.config-view {
  width: 100%;
  height: 100%;
}

/* 确保 3D 场景容器始终占满空间 */
.scene-view {
  position: relative;
  display: flex;
}

/* 3D场景容器样式 */
.scene-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 其他视图容器样式 */
.preview-view,
.config-view {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

/* 添加中间列布局样式 */
.panel {
  display: flex;
  flex-direction: column;
}

.scene-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 重要：允许内容收缩 */
}

.bottom-section {
  height: 200px; /* 或者其他合适的高度 */
  border-top: 1px solid #1e1e1e;
  display: flex;
  flex-direction: column;
}
</style> 