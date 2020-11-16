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
    const mapData = ref<MapData>({})
    const nameList = ref<MapNameItem[]>([])
    const x = ref(0)
    const y = ref(0)
    const s = ref(1)
    const leastWidth = ref(0)
    const transform = ref('')
    const style = computed(() => ({
      '--size-stroke': mapData.value.radius / leastWidth.value / s.value,
      transform: transform.value
    }))


    watch(type, async () => {
      x.value = 0
      y.value = 0
      s.value = 1
      transform.value = ''
      mapData.value = await get<MapData>(path.value)
    })

    onMounted(() => {
      const square = document.getElementById('app')
      const screeWidth = square.offsetWidth
      const screeHeight = square.offsetHeight
      const hammer = new Manager(square)
      const pan = new Pan()
      const pinch = new Pinch()
      const tap = new Tap()

      leastWidth.value =
        window.matchMedia('(orientation: portrait)').matches ? screeWidth : screeHeight

      hammer.add([pan, pinch, tap])
      hammer.get('pinch').set({ enable: true })
      hammer.on('panmove', ({ deltaX, deltaY }) => {
        setTransform(x.value + deltaX, y.value + deltaY, s.value)
      })
      hammer.on('panend', ({ deltaX, deltaY }) => {
        x.value += deltaX
        y.value += deltaY
      })
      hammer.on('pinchmove', ({ scale, center }) => {
        setTransform(
          x.value + (center.x - screeWidth / 2 - x.value) * (1 - scale),
          y.value + (center.y - screeHeight / 2 - y.value) * (1 - scale),
          s.value * scale
        )
      })
      hammer.on('pinchend', ({ scale, center }) => {
        s.value *= scale
        x.value += (center.x - screeWidth / 2 - x.value) * (1 - scale)
        y.value += (center.y - screeHeight / 2 - y.value) * (1 - scale)
      })
      // hammer.on('tap', ev => {
        // console.log(ev);
        // TODO: 点击弹窗？
      // })
      square.onmousewheel = mouseWheel
      if (square.addEventListener) {
        square.addEventListener('DOMMouseScroll', mouseWheel, false)
      }

      function mouseWheel(e) {
        direction(e).then(direction => { //TODO: 处理节流
          const m = getMousePos()
          s.value *= (direction ? 1.1 : 0.9)
          x.value += (m.x - screeWidth / 2 - x.value) * (direction ? -0.1 : 0.1)
          y.value += (m.y - screeHeight / 2 - y.value) * (direction ? -0.1 : 0.1)
          setTransform(x.value, y.value, s.value)
        })
      }
    })

    function setTransform(x: number, y: number, s: number) {
      transform.value = `translate3d(${x}px, ${y}px, 0px) scale3d(${s}, ${s}, 1)`
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
