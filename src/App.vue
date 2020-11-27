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
  <tip-point :message="tipPoint.message" :style="tipPoint.style" />
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useColorList, useControl, useLoadMapData, useMapList } from './composables/index'
import { MapNameItem, MapPoint } from './types/index'
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'
import SerachBox from './components/SerachBox.vue'
import SelectSource from './components/SelectSource.vue'
import ConfigColor from './components/ConfigColor.vue'
import TipMessage from './components/TipMessage.vue'
import TipPoint from './components/TipPoint.vue'

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
    const { loading, mapData } = useLoadMapData(type)
    const { x, y, s, leastWidth, transform, setTransform, tipPoint } = useControl(mapData)
    const nameList = ref<MapNameItem[]>([])
    const style = computed(() => ({
      ...color.value,
      '--size-stroke': mapData.value.radius / leastWidth.value / s.value,
      transform: transform.value,
    }))

    watch(type, refresh)

    function refresh() {
      x.value = 0
      y.value = 0
      s.value = 1
      transform.value = ''
    }

    function setNameList(value: MapNameItem[]) {
      nameList.value = value
    }

    function moveMap(poit: MapPoint) {
      const _s = 0.45 * s.value * leastWidth.value / mapData.value.radius
      x.value = -(poit.x - mapData.value.center.x) * _s
      y.value = -(poit.z - mapData.value.center.z) * _s
      setTransform(x.value, y.value, s.value)
    }

    function setOverPoint(value: { message: string, style: object }) {
      tipPoint.value = value
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
      tipPoint,
      setOverPoint,
    }
  }
}
</script>
