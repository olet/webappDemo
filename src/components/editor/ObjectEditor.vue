<template>
  <div class="editor-content">
    <!-- 根据标签页类型显示不同内容 -->
    <div v-if="activeTab === 'scene.json'" class="json-editor">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="100"
      >
        <!-- 基本属性 -->
        <n-form-item label="名称">
          <n-input v-model:value="formValue.name" placeholder="输入对象名称" />
        </n-form-item>

        <!-- 变换属性 -->
        <n-divider title-placement="left">变换</n-divider>
        
        <!-- 位置 -->
        <n-form-item label="位置">
          <n-input-group>
            <n-input-number
              v-model:value="formValue.position.x"
              :step="0.1"
              placeholder="X"
              style="width: 33%"
            />
            <n-input-number
              v-model:value="formValue.position.y"
              :step="0.1"
              placeholder="Y"
              style="width: 33%"
            />
            <n-input-number
              v-model:value="formValue.position.z"
              :step="0.1"
              placeholder="Z"
              style="width: 33%"
            />
          </n-input-group>
        </n-form-item>

        <!-- 旋转 -->
        <n-form-item label="旋转">
          <n-input-group>
            <n-input-number
              v-model:value="formValue.rotation.x"
              :step="1"
              placeholder="X"
              style="width: 33%"
            />
            <n-input-number
              v-model:value="formValue.rotation.y"
              :step="1"
              placeholder="Y"
              style="width: 33%"
            />
            <n-input-number
              v-model:value="formValue.rotation.z"
              :step="1"
              placeholder="Z"
              style="width: 33%"
            />
          </n-input-group>
        </n-form-item>

        <!-- 缩放 -->
        <n-form-item label="缩放">
          <n-input-group>
            <n-input-number
              v-model:value="formValue.scale.x"
              :step="0.1"
              placeholder="X"
              style="width: 33%"
            />
            <n-input-number
              v-model:value="formValue.scale.y"
              :step="0.1"
              placeholder="Y"
              style="width: 33%"
            />
            <n-input-number
              v-model:value="formValue.scale.z"
              :step="0.1"
              placeholder="Z"
              style="width: 33%"
            />
          </n-input-group>
        </n-form-item>

        <!-- 材质属性 -->
        <n-divider title-placement="left">材质</n-divider>
        
        <n-form-item label="颜色">
          <n-color-picker v-model:value="formValue.material.color" />
        </n-form-item>

        <n-form-item label="透明度">
          <n-slider
            v-model:value="formValue.material.opacity"
            :step="0.1"
            :min="0"
            :max="1"
          />
        </n-form-item>
      </n-form>
    </div>

    <div v-else-if="activeTab === 'config.ts'" class="config-editor">
      <div class="config-section">
        <h3>渲染设置</h3>
        <n-form>
          <n-form-item label="抗锯齿">
            <n-switch v-model:value="renderConfig.antialias" />
          </n-form-item>
          <n-form-item label="阴影">
            <n-switch v-model:value="renderConfig.shadows" />
          </n-form-item>
          <n-form-item label="后处理">
            <n-select
              v-model:value="renderConfig.postProcess"
              :options="postProcessOptions"
            />
          </n-form-item>
        </n-form>
      </div>

      <div class="config-section">
        <h3>物理设置</h3>
        <n-form>
          <n-form-item label="重力">
            <n-input-number
              v-model:value="physicsConfig.gravity"
              :step="0.1"
            />
          </n-form-item>
          <n-form-item label="碰撞检测">
            <n-select
              v-model:value="physicsConfig.collisions"
              :options="collisionOptions"
            />
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  NForm, 
  NFormItem, 
  NInput, 
  NInputNumber, 
  NInputGroup,
  NDivider,
  NColorPicker,
  NSlider,
  NSwitch,
  NSelect,
  FormInst,
  FormRules
} from 'naive-ui'

interface Vector3 {
  x: number
  y: number
  z: number
}

interface Material {
  color: string
  opacity: number
}

interface FormState {
  name: string
  position: Vector3
  rotation: Vector3
  scale: Vector3
  material: Material
}

const formRef = ref<FormInst | null>(null)
const formValue = ref<FormState>({
  name: '',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  material: {
    color: '#ffffff',
    opacity: 1
  }
})

const rules: FormRules = {
  name: {
    required: true,
    message: '请输入对象名称',
    trigger: 'blur'
  }
}

// 监听表单值变化并更新场景对象
watch(formValue, (newValue) => {
  // 确保数值类型正确
  const value = {
    ...newValue,
    position: {
      x: Number(newValue.position.x),
      y: Number(newValue.position.y),
      z: Number(newValue.position.z)
    },
    rotation: {
      x: Number(newValue.rotation.x),
      y: Number(newValue.rotation.y),
      z: Number(newValue.rotation.z)
    },
    scale: {
      x: Number(newValue.scale.x),
      y: Number(newValue.scale.y),
      z: Number(newValue.scale.z)
    }
  }
  emit('update', value)
}, { deep: true })

// 定义事件
const emit = defineEmits<{
  (e: 'update', value: FormState): void
}>()

// 暴露更新方法给父组件
defineExpose({
  updateForm(value: Partial<FormState>) {
    Object.assign(formValue.value, value)
  }
})

// 添加 activeTab prop
defineProps<{
  activeTab: string
}>()

// 渲染配置
const renderConfig = ref({
  antialias: true,
  shadows: true,
  postProcess: 'none'
})

const postProcessOptions = [
  { label: '无', value: 'none' },
  { label: 'SSAO', value: 'ssao' },
  { label: '泛光', value: 'bloom' },
  { label: '色调映射', value: 'tonemapping' }
]

// 物理配置
const physicsConfig = ref({
  gravity: -9.81,
  collisions: 'discrete'
})

const collisionOptions = [
  { label: '离散检测', value: 'discrete' },
  { label: '连续检测', value: 'continuous' },
  { label: '无', value: 'none' }
]
</script>

<style scoped>
.editor-content {
  padding: 16px;
}

.json-editor {
  padding: 16px;
}

.config-editor {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #1e1e1e;
  border-radius: 4px;
}

h3 {
  font-size: 12px;
  color: #858585;
  text-transform: uppercase;
  margin-bottom: 16px;
}

:deep(.n-form-item-label) {
  color: #ccc !important;
}

:deep(.n-input) {
  background-color: #1e1e1e !important;
}

:deep(.n-input-number) {
  background-color: #1e1e1e !important;
}

:deep(.n-input-number-input) {
  color: #ccc !important;
}

:deep(.n-divider) {
  color: #ccc !important;
}

:deep(.n-slider-rail) {
  background-color: #333 !important;
}

:deep(.n-color-picker-trigger) {
  border: 1px solid #333 !important;
}
</style> 