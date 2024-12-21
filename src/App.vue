<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <n-dialog-provider>
        <MainLayout ref="layoutRef" @update-object="updateSceneObject" @scene-tab-change="handleSceneTabChange">
          <template #default>
            <div class="scene-container" :style="{ display: isSceneVisible ? 'flex' : 'none' }">
              <canvas ref="renderCanvas"></canvas>
            </div>
          </template>
        </MainLayout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, AbstractMesh } from '@babylonjs/core'
import MainLayout from './components/layout/MainLayout.vue'
import { darkTheme } from 'naive-ui'

const renderCanvas = ref<HTMLCanvasElement | null>(null)
const layoutRef = ref<InstanceType<typeof MainLayout> | null>(null)
let engine: Engine | null = null
let scene: Scene | null = null
let selectedMesh: AbstractMesh | null = null

// 计算场景是否可见
const isSceneVisible = computed(() => {
  return layoutRef.value?.activeSceneTab === 'scene'
})

// 初始化场景
const initScene = () => {
  if (!renderCanvas.value) return

  // 初始化引擎
  engine = new Engine(renderCanvas.value, true)
  scene = new Scene(engine)

  // 创建相机
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
  camera.setTarget(Vector3.Zero())
  camera.attachControl(renderCanvas.value, true)

  // 创建光源
  new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

  // 创建一个示例立方体
  const box = MeshBuilder.CreateBox('box', { size: 2 }, scene)

  // 启动渲染循环
  engine.runRenderLoop(() => {
    scene?.render()
  })
}

// 处理场景标签页切换
const handleSceneTabChange = (tab: string) => {
  if (tab === 'scene') {
    // 延迟一帧，确保 DOM 已更新
    requestAnimationFrame(() => {
      if (engine) {
        engine.resize()
      }
    })
  }
}

onMounted(() => {
  initScene()

  // 响应窗口大小变化
  const resizeObserver = new ResizeObserver(() => {
    if (engine && isSceneVisible.value) {
      engine.resize()
    }
  })

  if (renderCanvas.value?.parentElement) {
    resizeObserver.observe(renderCanvas.value.parentElement)
  }

  // 清理
  onUnmounted(() => {
    resizeObserver.disconnect()
    scene?.dispose()
    engine?.dispose()
  })
})

// 处理场景点击事件
const onCanvasPointerDown = (event: PointerEvent) => {
  if (!scene || !layoutRef.value) return

  const pick = scene.pick(event.offsetX, event.offsetY)
  
  if (pick.hit && pick.pickedMesh) {
    // 取消之前选中的对象高亮
    if (selectedMesh) {
      selectedMesh.showBoundingBox = false
    }

    // 更新选中的对象
    selectedMesh = pick.pickedMesh
    selectedMesh.showBoundingBox = true

    // 通知编辑器更新
    layoutRef.value.onObjectSelected({
      name: selectedMesh.name,
      position: {
        x: selectedMesh.position.x,
        y: selectedMesh.position.y,
        z: selectedMesh.position.z
      },
      rotation: {
        x: selectedMesh.rotation.x * (180 / Math.PI),
        y: selectedMesh.rotation.y * (180 / Math.PI),
        z: selectedMesh.rotation.z * (180 / Math.PI)
      },
      scale: {
        x: selectedMesh.scaling.x,
        y: selectedMesh.scaling.y,
        z: selectedMesh.scaling.z
      },
      material: {
        color: '#ffffff', // 这里需要根据实际材质获取颜色
        opacity: selectedMesh.visibility
      }
    })
  } else {
    // 点击空处，取消选中
    if (selectedMesh) {
      selectedMesh.showBoundingBox = false
      selectedMesh = null
    }
    layoutRef.value.onObjectSelected(null)
  }
}

// 添加更新对象的方法
const updateSceneObject = (value: any) => {
  if (selectedMesh) {
    // 更新位置
    selectedMesh.position.set(value.position.x, value.position.y, value.position.z)
    
    // 更新旋转（需要转换为弧度）
    const toRadians = (degrees: number) => degrees * (Math.PI / 180)
    selectedMesh.rotation.set(
      toRadians(value.rotation.x),
      toRadians(value.rotation.y),
      toRadians(value.rotation.z)
    )
    
    // 更新缩放
    selectedMesh.scaling.set(value.scale.x, value.scale.y, value.scale.z)
    
    // 更新材质
    if (selectedMesh.material) {
      selectedMesh.material.alpha = value.material.opacity
      // 如果需要更新颜色，还需要设置材质的颜色属性
    }
  }
}
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  display: block;
}
</style> 