<template>
  <app-header :title="mapData.title">
    <serach-box :nameList="nameList" @move-map="moveMap" />
    <select-source v-model="type" />
  </app-header>
  <app-svg :data="mapData" :loading="loading" :style="style" @nameList="setNameList" />
  <config-color v-model="color" />
  <app-footer :uptime="mapData.uptime" :author="mapData.author" />
  <tip-message :type="type" :version="mapData.version" :introduce="mapData.introduce" />
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useColorList, useControl, useMapList } from './composables/index.ts'
import { get } from './utils/index.ts'
import { MapData, MapNameItem, MapPoint } from './types/index.d.ts'
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'
import SerachBox from './components/SerachBox.vue'
import SelectSource from './components/SelectSource.vue'
import ConfigColor from './components/ConfigColor.vue'
import TipMessage from './components/TipMessage.vue'

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
  },
  setup () {
    const color = useColorList()
    const type = useMapList()
    const path = computed(() => `/config/${type.value}.json`)
    const loading = ref(true)
    const mapData = ref<MapData>({})
    const nameList = ref<MapNameItem[]>([])
    const { x, y, s, leastWidth, transform, setTransform } = useControl()
    const style = computed(() => ({
      ...color.value,
      '--size-stroke': mapData.value.radius / leastWidth.value / s.value,
      transform: transform.value,
    }))

    getMapData()

    watch(type, getMapData)

    async function getMapData() {
      loading.value = true
      x.value = 0
      y.value = 0
      s.value = 1
      transform.value = ''
      mapData.value = await get<MapData>(path.value)
    }

    function setNameList(value: MapNameItem[]) {
      loading.value = false
      nameList.value = value
    }

    function moveMap(poit: MapPoint) {
      const _s = -0.45 * s.value * leastWidth.value / mapData.value.radius
      x.value = _s * poit.x
      y.value = _s * poit.z
      setTransform(x.value, y.value, s.value)
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
    }
  }
}
</script>
