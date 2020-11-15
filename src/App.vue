<template>
  <app-header :title="mapData.title">
    <select-source v-model="type" />
    <!-- TODO: 增加搜索、配置、下载组件 -->
  </app-header>
  <app-svg :data="mapData" :style="style" @nameList="setNameList" />
  <app-footer :uptime="mapData.uptime" :author="mapData.author" />
  <!-- TODO: 增加加载、提示组件 -->
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Manager, Pan, Pinch, Tap } from '@egjs/hammerjs'
import { get, direction, getMousePos } from './utils/index.ts'
import { MapData, MapNameItem } from './types/index.d.ts'
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'
import SelectSource from './components/SelectSource.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSvg,
    AppFooter,
    SelectSource,
  },
  setup () {
    const type = ref('')
    const path = computed(() => `/config/${type.value}.json`)
    const mapData = ref({})
    const nameList = ref<MapNameItem[]>([])
    const x = ref(0)
    const y = ref(0)
    const s = ref(1)
    const style = ref({
      transform: ''
    })

    watch(type, async () => {
      mapData.value = await get<MapData>(path.value)
    })

    onMounted(() => {
      const square = document.getElementById('app');
      const hammer = new Manager(square)
      const pan = new Pan()
      const pinch = new Pinch()
      const tap = new Tap()

      hammer.add([pan, pinch, tap])
      hammer.get('pinch').set({ enable: true })
      hammer.on('panmove', ({ deltaX, deltaY }) => {
        style.value.transform = `translate3d(${x.value + deltaX}px, ${y.value + deltaY}px, 0px)`
      })
      hammer.on('panend', ({ deltaX, deltaY }) => {
        x.value += deltaX
        y.value += deltaY
      })
      hammer.on('pinchmove', ({ scale }) => {
        console.log(scale);

        style.value.transform = `scale3d(${s.value * scale}, ${s.value * scale}, 1)`
      })
      hammer.on('pinchend', ({ scale, center }) => {
        console.log(center);
        
        s.value *= scale
        x.value += (center.x - x.value) * (1 - scale) //TODO: 验证结果
        y.value += (center.y - y.value) * (1 - scale)
      })
      // hammer.on('tap', ev => {
        // console.log(ev);
        // TODO: 点击弹窗？
      // })
      square.onmousewheel = mouseWheel
      if (square.addEventListener) {
        square.addEventListener('DOMMouseScroll', mouseWheel, false)
      }
    })

    function mouseWheel(e) {
      direction(e).then(direction => {
        const m = getMousePos()
        s.value *= (direction ? 1.1 : 0.9)
        x.value += (m.x - x.value) * (direction ? -0.1 : 0.1) // TODO: 重新计算位置
        y.value += (m.y - y.value) * (direction ? -0.1 : 0.1)
        style.value.transform = `translate3d(${x.value}px, ${y.value}px, 0px) scale3d(${s.value}, ${s.value}, 1)`
      })
    }

    function setNameList(value: MapNameItem[]) {
      nameList.value = value
    }

    return {
      type,
      mapData,
      nameList,
      setNameList,
      style,
    }
  }
}
</script>
