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
  <tip-point :message="pointMessage" :style="pointStyle" />
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
    const {
      translateX,
      translateY,
      scale,
      relativeScale,
      transform,
      setTransform,
      pointMessage,
      pointStyle
    } = useControl(mapData)
    const nameList = ref<MapNameItem[]>([])
    const style = computed(() => ({
      ...color.value,
      '--size-stroke': 1 / relativeScale.value,
      transform: transform.value,
    }))

    watch(type, refresh)

    function refresh() {
      translateX.value = 0
      translateY.value = 0
      scale.value = 1
      transform.value = ''
    }

    function setNameList(value: MapNameItem[]) {
      nameList.value = value
    }

    function moveMap(poit: MapPoint) {
      translateX.value = -(poit.x - mapData.value.center.x) * relativeScale.value
      translateY.value = -(poit.z - mapData.value.center.z) * relativeScale.value
      setTransform(translateX.value, translateY.value, scale.value)
    }

    function setOverPoint({ message, style }: { message: string, style: object }) {
      pointMessage.value = message
      pointStyle.value = style
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
      pointMessage,
      pointStyle,
      setOverPoint,
    }
  }
}
</script>
