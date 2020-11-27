<template>
  <app-header :title="mapData.title">
    <serach-box :nameList="nameList" @move-map="moveMap" />
    <select-source v-model="type" />
  </app-header>
  <app-svg
    :data="mapData"
    :loading="loading"
    :style="style"
    @name-list="setNameList"
    @over-path="setOverPoint"
  />
  <config-color v-model="color" />
  <app-footer :uptime="mapData.uptime" :author="mapData.author" />
  <tip-message :type="type" :version="mapData.version" :introduce="mapData.introduce" />
  <tip-point :message="tipPointMessage" :style="tipPointStyle" />
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useColorList, useControl, useMapList } from './composables/index'
import { get } from './utils/index'
import { MapData, MapNameItem, MapPoint } from './types/index'
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'
import SerachBox from './components/SerachBox.vue'
import SelectSource from './components/SelectSource.vue'
import ConfigColor from './components/ConfigColor.vue'
import TipMessage from './components/TipMessage.vue'
import TipPoint from './components/TipPoint.vue'

const defaultMap: MapData = {
  title: '',
  radius: 0,
  center: { x: 0, z: 0 },
  data: []
}

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSvg,
    AppFooter,
    SerachBox,
    SelectSource,
    ConfigColor,
    TipMessage,
    TipPoint,
  },
  setup () {
    const color = useColorList()
    const type = useMapList()
    const path = computed(() => `/config/${type.value}.json`)
    const loading = ref(true)
    const mapData = ref(defaultMap)
    const nameList = ref<MapNameItem[]>([])
    const { x, y, s, leastWidth, transform, setTransform, deltaTap } = useControl()
    const tipPointMessage = ref('')
    const tipPointStyle = ref({})
    const style = computed(() => ({
      ...color.value,
      '--size-stroke': mapData.value.radius / leastWidth.value / s.value,
      transform: transform.value,
    }))

    getMapData()

    watch(type, getMapData)
    watch(deltaTap, setTipPoint)

    async function getMapData() {
      loading.value = true
      x.value = 0
      y.value = 0
      s.value = 1
      transform.value = ''
      mapData.value = defaultMap
      mapData.value = await get<MapData>(path.value)
    }

    function setNameList(value: MapNameItem[]) {
      loading.value = false
      nameList.value = value
    }

    function moveMap(poit: MapPoint) {
      const _s = 0.45 * s.value * leastWidth.value / mapData.value.radius
      x.value = -(poit.x - mapData.value.center.x) * _s
      y.value = -(poit.z - mapData.value.center.z) * _s
      setTransform(x.value, y.value, s.value)
    }

    function setTipPoint() {
      if (deltaTap.value) {
        const _s = 0.45 * s.value * leastWidth.value / mapData.value.radius
        const _x = ~~(deltaTap.value.px / _s + mapData.value.center.x)
        const _z = ~~(deltaTap.value.pz / _s + mapData.value.center.z)
        tipPointMessage.value = deltaTap.value ? `x: ${_x}, z: ${_z}` : ''
        tipPointStyle.value = {
          left: deltaTap.value.x + 'px',
          top: deltaTap.value.y + 'px',
        }
      } else {
        tipPointMessage.value = ''
        tipPointStyle.value = {}
      }
    }

    function setOverPoint({ style, message }: { style: object, message: string }) {
      tipPointMessage.value = message
      tipPointStyle.value = style
    }

    return {
      type,
      color,
      loading,
      mapData,
      nameList,
      setNameList,
      style,
      moveMap,
      tipPointMessage,
      tipPointStyle,
      setOverPoint,
    }
  }
}
</script>
